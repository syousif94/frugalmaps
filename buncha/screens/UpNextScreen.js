import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { refresh } from "../store/events";
import * as Cities from "../store/cities";
import UpNextItem, { columns, itemMargin } from "../components/UpNextItem";
import TopBar from "../components/TopBar";
import { enableLocation } from "../store/permissions";
import { WEB, IOS, ANDROID } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
// import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import emitter from "tiny-emitter/instance";
import FilterView from "../components/FilterView";
import SortBar from "../components/SortBar";
import EventSearchInput from "../components/EventSearchInput";
import { getInset } from "../utils/SafeAreaInsets";
import { PAGE } from "../store/filters";
import { useEveryMinute } from "../utils/Hooks";
import moment from "moment";

let tabBarHeight;

if (!WEB) {
  tabBarHeight = require("../components/TabBar").tabBarHeight;
}

const topInset = IOS ? getInset("top") : 0;

const narrow = 600;

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
        offset: -topInset
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
                  alignItems: "stretch",
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
                      marginVertical: width < narrow ? 6 : 8,
                      flexDirection: "column"
                    }}
                    style={{
                      height: "100%",
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
              top: topInset,
              bottom: tabBarHeight,
              left: 0,
              right: 0
            }}
            contentContainerStyle={{
              paddingBottom: ANDROID ? tabBarHeight : null
            }}
            progressViewOffset={70}
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

const ListHeaderFilterButton = () => {
  const [currentTime] = useEveryMinute();
  const refreshing = useSelector(state => state.events.refreshing);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  const day = useSelector(state => state.events.day);
  const locationText = useSelector(state => {
    const city = state.events.city;
    const locationEnabled = state.permissions.location;
    const locationText =
      city && city.text.length
        ? city.text.split(",")[0]
        : locationEnabled
        ? "Locating"
        : "Everywhere";
    return locationText;
  });
  const count = useSelector(state => state.events.upNext.length);

  let dayText = "";
  if (day) {
    dayText = day.title;
  } else {
    const today = moment(now);
    dayText = today.format("dddd h:mma");
  }

  let fromNow = "";
  if (refreshing) {
    fromNow = `Refreshing`;
  } else if (!notNow) {
    const minDiff = Math.round((currentTime - now) / 60000);
    if (minDiff >= 60) {
      fromNow = `Refreshed ${parseInt(minDiff / 60, 10)}h ${minDiff % 60}m ago`;
    } else if (minDiff >= 1) {
      fromNow = `Refreshed ${minDiff}m ago`;
    } else {
      fromNow = `Refreshed Just Now`;
    }
  } else if (day) {
    fromNow = day.away ? `${day.away}d away` : "Today";
  } else {
    const minDiff = Math.round(Math.abs(now - currentTime) / 60000);
    if (minDiff >= 60) {
      const totalHours = parseInt(minDiff / 60, 10);
      const days = Math.floor(totalHours / 24);
      if (days) {
        fromNow += `${days}d `;
      }
      const hours = totalHours % 24;
      fromNow += `${hours}h ${minDiff % 60}m away`;
    } else if (minDiff >= 0) {
      fromNow = `${minDiff}m away`;
    }
  }

  let countText = "";
  if (!refreshing && count > 0) {
    countText = ` · ${count} event${count !== 1 ? "s" : ""}`;
  }

  const onPress = () => {
    requestAnimationFrame(() => {
      emitter.emit("filters", PAGE.WHEN);
    });
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 30,
          color: "#000",
          fontWeight: "800"
        }}
      >
        {dayText}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 13,
          color: "#999",
          fontWeight: "500",
          textTransform: "uppercase"
        }}
      >
        {fromNow}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 20,
          color: "#777",
          fontWeight: "800",
          textTransform: "uppercase",
          marginTop: 6,
          paddingBottom: 15
        }}
      >
        {locationText}
        {countText}
      </Text>
    </TouchableOpacity>
  );
};

const ListHeader = () => (
  <View>
    <View
      style={{
        marginTop: ANDROID ? 7 : 10,
        paddingHorizontal: itemMargin
      }}
    >
      <ListHeaderFilterButton />
      <EventSearchInput
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center"
        }}
      />
    </View>

    <SortBar
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: itemMargin - 2,
        marginTop: 3
      }}
      buttonStyle={{
        paddingVertical: 6,
        paddingRight: 4,
        paddingLeft: 6,
        borderRadius: 5
      }}
    />
  </View>
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
