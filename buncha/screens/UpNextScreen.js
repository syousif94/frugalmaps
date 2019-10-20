import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import UpNextItem, { columns, itemMargin } from "../components/UpNextItem";
import TopBar from "../components/TopBar";
import { enableLocation } from "../store/permissions";
import { WEB, IOS, ANDROID } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
import { useCitiesToggle } from "../utils/Hooks";
// import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import emitter from "tiny-emitter/instance";
import FilterView from "../components/FilterView";
import SortBar from "../components/SortBar";

let tabBarHeight;
let topBarHeight;
if (!WEB) {
  tabBarHeight = require("../components/TabBar").tabBarHeight;
  topBarHeight = require("../components/TopBar").topBarHeight;
}

const narrow = 600;

export default ({ intro = false }) => {
  const data = useSelector(state => state.events.upNext);
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
        offset: topBarHeight
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

  useEffect(() => {
    if (
      IOS &&
      !refreshing &&
      !initialLoadCompleted.current &&
      (data.length || error)
    ) {
      initialLoadCompleted.current = true;
      listRef.current.scrollToOffset({
        animated: false,
        offset: -topBarHeight
      });
    }
  }, [refreshing, initialLoadCompleted, data, error]);

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
    const onEvent = () => {
      if (IOS) {
        initialLoadCompleted.current = false;
        requestAnimationFrame(() => {
          dispatch({
            type: "filters/set",
            payload: {
              page: null
            }
          });
        });
        setTimeout(() => {
          listRef.current.scrollToOffset({
            animated: true,
            offset: -(topBarHeight + 54)
          });
        }, 350);
      } else if (ANDROID) {
        listRef.current.scrollToOffset({
          animated: false,
          offset: 0
        });
        requestAnimationFrame(() => {
          dispatch({
            type: "filters/set",
            payload: {
              page: null
            }
          });
        });
      } else if (WEB) {
        requestAnimationFrame(() => {
          dispatch({
            type: "filters/set",
            payload: {
              page: null
            }
          });
        });
      }
    };

    emitter.on("refresh", onEvent);

    return () => {
      emitter.off("refresh", onEvent);
    };
  }, []);

  const [citiesTranslate, toggleCities] = useCitiesToggle();

  return (
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
            <SortBar
              style={{
                marginTop: 10,
                marginBottom: 5,
                marginHorizontal: width < 900 || width > 920 ? null : 8,
                backgroundColor: width < 900 ? null : "#f0f0f0",
                borderRadius: width < 900 ? null : 6,
                borderWidth: width < 900 ? null : 0.5,
                borderColor: width < 900 ? null : "rgba(0,0,0,0.05)"
              }}
              buttonStyle={{
                paddingVertical: width < 900 ? 4 : 3,
                paddingRight: width < 900 ? 4 : 3,
                paddingLeft: width < 900 ? 6 : 5
              }}
              contentContainerStyle={{ paddingHorizontal: width < 900 ? 8 : 2 }}
            />
            {error ? (
              <ListError />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  paddingHorizontal: width < narrow ? 8 : 10
                }}
              >
                {data.map((item, index) => (
                  <UpNextItem
                    key={item._id}
                    item={item}
                    index={index}
                    containerStyle={{
                      width: width < narrow ? "50%" : "33.33%",
                      paddingHorizontal: width < narrow ? 8 : 10,
                      marginVertical: width < narrow ? 6 : 8
                    }}
                    style={{
                      width: "100%",
                      marginLeft: 0,
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
              paddingHorizontal: width > narrow ? 16.5 : 4.5
            }}
          />
        </React.Fragment>
      ) : (
        <View style={styles.list}>
          <FlatList
            ref={listRef}
            renderItem={data => {
              return <UpNextItem {...data} />;
            }}
            contentInset={{
              top: topBarHeight,
              bottom: tabBarHeight,
              left: 0,
              right: 0
            }}
            contentContainerStyle={{
              paddingTop: ANDROID ? topBarHeight : null,
              paddingBottom: ANDROID ? tabBarHeight : null
            }}
            progressViewOffset={topBarHeight}
            numColumns={columns}
            data={data}
            style={styles.list}
            contentInsetAdjustmentBehavior="never"
            keyExtractor={item => item._id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={() => (data.length ? <ListFooter /> : null)}
            ListEmptyComponent={() => (error ? <ListError /> : null)}
          />
          <TopBar
            rotate={citiesTranslate.current}
            toggle={toggleCities}
            style={{ paddingHorizontal: itemMargin }}
            containerStyle={{
              position: "absolute",
              top: 0,
              left: 0
            }}
          />
        </View>
      )}
      {WEB && (refreshing || (!data.length && !error && !intro)) ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : null}
    </View>
  );
};

const ListHeader = () => (
  <SortBar
    style={{ flex: 1 }}
    contentContainerStyle={{
      marginTop: 5,
      paddingHorizontal: 5
    }}
    buttonStyle={{
      paddingVertical: 4,
      paddingRight: 4,
      paddingLeft: 6
    }}
  />
);

const ListFooter = () => {
  return (
    <View
      style={{
        minWidth: "100%",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#f2f2f2",
        paddingHorizontal: WEB ? 20 : itemMargin,
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
