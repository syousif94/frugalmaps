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
import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import { getInset } from "../utils/SafeAreaInsets";
import emitter from "tiny-emitter/instance";

let tabBarHeight;
if (!WEB) {
  tabBarHeight = require("../components/TabBar").tabBarHeight;
}

const narrow = 600;

export default () => {
  // const data = useSelector(state =>
  //   state.events.markers.sort((a, b) => a._source.location > b._source.location)
  // );
  const data = useSelector(state => state.events.upNext);
  const refreshing = useSelector(state => state.events.refreshing);
  const error = useSelector(state => state.events.error);
  const locationEnabled = useSelector(state => state.permissions.location);
  const dispatch = useDispatch();
  const onRefresh = useCallback(() => dispatch(refresh()), []);
  const listRef = useRef(null);
  const [opacity, setOpacity] = useState(WEB ? 0 : 1);

  useEffect(() => {
    dispatch(enableLocation());
  }, []);

  useEffect(() => {
    if (WEB) {
      const history = getHistory();

      const unlisten = history.listen(location => {
        const home = location.pathname === "/";
        setOpacity(home ? 1 : 0);
        if (home && !data.length && !refreshing && !error) {
          onRefresh();
          dispatch(Cities.get());
        }
      });

      return () => unlisten();
    }
  }, [data, refreshing, error]);

  useEffect(() => {
    if (locationEnabled === null) {
      return;
    }

    if (!WEB && !data.length && !refreshing && !error) {
      listRef.current.scrollToOffset({
        animated: false,
        offset: getInset("top") + 68
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
        offset: -(getInset("top") + 68)
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
            animated: false,
            offset: -(getInset("top") + 68 + 44)
          });
        }, 500);
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
        <ScrollView
          ref={listRef}
          style={styles.list}
          contentContainerStyle={[styles.listContent]}
        >
          <AppBanner />
          <TopBar
            rotate={citiesTranslate.current}
            toggle={toggleCities}
            style={{ paddingHorizontal: width > narrow ? 25 : 20 }}
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
      ) : (
        <View style={styles.list}>
          <FlatList
            ref={listRef}
            renderItem={data => {
              return <UpNextItem {...data} />;
            }}
            contentInset={{
              top: getInset("top") + 68,
              bottom: tabBarHeight,
              left: 0,
              right: 0
            }}
            contentContainerStyle={{
              paddingTop: ANDROID ? 68 : null,
              paddingBottom: ANDROID ? tabBarHeight : null
            }}
            progressViewOffset={68}
            numColumns={columns}
            data={data}
            style={styles.list}
            contentInsetAdjustmentBehavior="never"
            keyExtractor={item => item._id}
            refreshing={refreshing}
            onRefresh={onRefresh}
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
      {WEB && refreshing ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : null}
    </View>
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
