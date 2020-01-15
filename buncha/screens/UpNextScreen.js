import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Text,
  Dimensions
} from "react-native";
import { refresh } from "../store/events";
import * as Cities from "../store/cities";
import UpNextItem, { itemMargin, columns } from "../components/UpNextItem";
import TopBar from "../components/TopBar";
import { enableLocation } from "../store/permissions";
import { WEB, IOS, ANDROID } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
// import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import emitter from "tiny-emitter/instance";
import FilterView from "../components/FilterView";
import { getInset } from "../utils/SafeAreaInsets";
import EventListHeader from "../components/EventListHeader";
import SearchAccessory from "../components/SearchAccessory";
import { InputProvider } from "../components/InputContext";
import TagList from "../components/TagList";

let tabBarHeight;

if (!WEB) {
  tabBarHeight = require("../components/TabBar").tabBarHeight;
}

const topInset = IOS ? getInset("top") : 0;

const medium = 780;
const narrow = 550;

export default ({ intro = false }) => {
  const data = useSelector(state => state.events.upNext, shallowEqual);
  const refreshing = useSelector(state => state.events.refreshing);
  const error = useSelector(state => state.events.error);
  const locationEnabled = useSelector(state => state.permissions.location);
  const dispatch = useDispatch();
  const onRefresh = useCallback(() => dispatch(refresh()), []);
  const listRef = useRef(null);
  const [opacity, setOpacity] = useState(
    WEB && location.pathname !== "/" ? 0 : 1
  );

  useEffect(() => {
    if (
      !refreshing &&
      !data.length &&
      !intro &&
      locationEnabled === null &&
      (!WEB || location.pathname === "/")
    ) {
      dispatch(enableLocation());
    }
  }, []);

  useEffect(() => {
    if (WEB) {
      const history = getHistory();

      const unlisten = history.listen(location => {
        const home = location.pathname === "/";
        setOpacity(home ? 1 : 0);
        if (home && !data.length && !refreshing && !error) {
          if (locationEnabled === null && !intro) {
            dispatch(enableLocation());
          } else if (!intro) {
            onRefresh();
            dispatch(Cities.get());
          }
        }
      });

      return () => unlisten();
    }
  }, [data, refreshing, error, locationEnabled, intro]);

  useEffect(() => {
    if (locationEnabled === null) {
      return;
    }

    if (!WEB && !data.length && !refreshing && !error) {
      listRef.current.scrollToOffset({
        animated: false,
        offset: topInset
      });
      onRefresh();
      dispatch(Cities.get());
    } else if (WEB) {
      const history = getHistory();
      if (
        history.location.pathname === "/" &&
        !data.length &&
        !refreshing &&
        !error
      ) {
        setOpacity(1);
        onRefresh();
        dispatch(Cities.get());
      }
    }
  }, [locationEnabled, data, refreshing, error]);

  const initialLoadCompleted = useRef(false);

  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const onChange = ({ window }) => {
      setWidth(window.width);
    };

    Dimensions.addEventListener("change", onChange);

    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const dismissFilters = () => {
      emitter.emit("filters");
    };
    const onEvent = () => {
      if (IOS) {
        initialLoadCompleted.current = false;
        requestAnimationFrame(dismissFilters);
        setTimeout(() => {
          listRef.current.scrollToOffset({
            animated: true,
            offset: -(topInset + 54)
          });
        }, 350);
      } else if (ANDROID) {
        listRef.current.scrollToOffset({
          animated: false,
          offset: 0
        });
        requestAnimationFrame(dismissFilters);
      } else if (WEB) {
        requestAnimationFrame(dismissFilters);
      }
    };

    emitter.on("refresh", onEvent);

    return () => {
      emitter.off("refresh", onEvent);
    };
  }, []);

  return (
    <InputProvider>
      <View style={[styles.container, { opacity }]}>
        {WEB ? (
          <Helmet>
            <title>Buncha</title>
          </Helmet>
        ) : null}
        {WEB ? (
          <React.Fragment>
            <ScrollView
              ref={listRef}
              style={styles.list}
              contentContainerStyle={[styles.listContent, { paddingTop: 48 }]}
            >
              {/* <AppBanner /> */}
              <TagList style={{ marginVertical: 10 }} />
              {error ? (
                <ListError />
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    alignItems: "stretch",
                    paddingHorizontal: width < medium ? 8 : 10
                  }}
                >
                  {data.map((item, index) => (
                    <UpNextItem
                      key={item._id}
                      item={item}
                      index={index}
                      containerStyle={{
                        width:
                          width < medium
                            ? width < narrow
                              ? "50%"
                              : "33.33%"
                            : "25%",
                        paddingHorizontal: width < medium ? 8 : 10,
                        marginTop: width < medium ? 6 : 8,
                        flexDirection: "column"
                      }}
                      style={{
                        height: "100%",
                        paddingVertical: 0
                      }}
                    />
                  ))}
                </View>
              )}

              {data.length ? <ListFooter /> : null}
            </ScrollView>
            <FilterView />
            <TopBar
              width={width}
              contentContainerStyle={{
                paddingHorizontal: width > medium ? 16.5 : 4.5
              }}
            />
          </React.Fragment>
        ) : (
          <View style={styles.list}>
            <FlatList
              ref={listRef}
              renderItem={data => {
                return (
                  <UpNextItem
                    {...data}
                    style={{
                      paddingHorizontal: itemMargin / 2
                    }}
                  />
                );
              }}
              columnWrapperStyle={{
                width: width > 500 ? "25%" : "50%"
              }}
              contentInset={{
                top: topInset,
                bottom: tabBarHeight,
                left: 0,
                right: 0
              }}
              contentContainerStyle={{
                paddingBottom: ANDROID ? tabBarHeight : null,
                paddingHorizontal: itemMargin / 2
              }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              progressViewOffset={70}
              numColumns={columns}
              data={data}
              style={styles.list}
              contentInsetAdjustmentBehavior="never"
              keyExtractor={item => item._id}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListHeaderComponent={EventListHeader}
              ListFooterComponent={() => (data.length ? <ListFooter /> : null)}
              ListEmptyComponent={() => (error ? <ListError /> : null)}
            />
            <SearchAccessory />
          </View>
        )}
        {WEB && (refreshing || (!data.length && !error && !intro)) ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : null}
      </View>
    </InputProvider>
  );
};

const ListFooter = () => {
  return (
    <View
      style={{
        minWidth: "100%",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#f2f2f2",
        paddingHorizontal: WEB ? 20 : itemMargin / 2,
        paddingTop: 10,
        paddingBottom: 60
      }}
    >
      <Text style={{ color: "#ccc", fontSize: 12, fontWeight: "700" }}>
        The end
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loading: {
    position: "absolute",
    top: 140,
    alignSelf: WEB ? "center" : "stretch"
  },
  list: {
    backgroundColor: "#fff",
    flex: 1
  },
  listContent: {
    backgroundColor: "#fff",
    width: "100%",
    minHeight: "100%",
    maxWidth: WEB ? 900 : null,
    alignSelf: WEB ? "center" : "stretch"
  }
});
