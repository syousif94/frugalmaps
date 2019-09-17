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
import { get } from "../store/events";
import * as Cities from "../store/cities";
import Item from "../components/EventItem";
import UpNextItem, { columns, itemMargin } from "../components/UpNextItem";
// import PlaceItem from "../components/PlaceItem";
import TopBar from "../components/TopBar";
import { enableLocation } from "../store/permissions";
import { WEB, IOS } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
import SortBar from "../components/SortBar";
import SearchPanel from "../components/SearchPanel";
import { useCitiesToggle } from "../utils/Hooks";
import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import { getInset } from "../utils/SafeAreaInsets";

let tabBarHeight;
if (!WEB) {
  tabBarHeight = require("../components/TabBar").tabBarHeight;
}

const narrow = 550;

export default () => {
  // const data = useSelector(state =>
  //   state.events.markers.sort((a, b) => a._source.location > b._source.location)
  // );
  const data = useSelector(state => state.events.upNext);
  const refreshing = useSelector(state => state.events.refreshing);
  const error = useSelector(state => state.events.error);
  const locationEnabled = useSelector(state => state.permissions.location);
  const dispatch = useDispatch();
  const refresh = useCallback(() => dispatch(get()), []);
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
          refresh();
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
      refresh();
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
        refresh();
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
            <React.Fragment>
              {/* <SortBar /> */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  paddingHorizontal: width > narrow ? 10 : null
                }}
              >
                {data.map((item, index) => (
                  <View
                    style={{
                      width:
                        width > 900
                          ? "33.33%"
                          : width > narrow
                          ? "50%"
                          : "100%",
                      paddingHorizontal: width > narrow ? 10 : null,
                      paddingLeft: width <= narrow ? 10 : null,
                      paddingVertical: width > narrow ? 10 : null
                    }}
                    key={item._id}
                  >
                    <Item
                      item={item}
                      index={index}
                      style={{
                        backgroundColor: width > narrow ? "#f4f4f4" : null,
                        borderRadius: width > narrow ? 8 : null
                      }}
                    />
                    {width <= narrow ? <View style={styles.separator} /> : null}
                  </View>
                ))}
              </View>
            </React.Fragment>
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
            numColumns={columns}
            data={data}
            style={styles.list}
            contentInsetAdjustmentBehavior="never"
            keyExtractor={item => item._id}
            refreshing={refreshing}
            onRefresh={refresh}
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
    flex: 1
  },
  listContent: {
    width: "100%",
    minHeight: "100%",
    borderColor: "#f2f2f2",
    maxWidth: WEB ? 900 : null,
    alignSelf: WEB ? "center" : "stretch"
  },
  separator: {
    marginBottom: WEB ? null : 10,
    height: 1,
    backgroundColor: "#f2f2f2"
  }
});
