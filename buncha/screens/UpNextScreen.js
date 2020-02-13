import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Dimensions
} from "react-native";
import { refresh } from "../store/events";
import * as Cities from "../store/cities";
import UpNextItem, { itemMargin } from "../components/UpNextItem";
import TopBar from "../components/TopBar";
import { enableLocation } from "../store/permissions";
import { WEB, IOS, ANDROID } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
// import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import emitter from "tiny-emitter/instance";
import FilterView from "../components/FilterView";
import { InputProvider } from "../components/InputContext";
import TagList from "../components/TagList";
import RefreshButton from "../components/RefreshButton";
import MapView from "../components/MapView";
import EventList from "../components/EventList";

const medium = 780;
const narrow = 550;

export default ({ intro = false }) => {
  const data = useSelector(state => state.events.upNext, shallowEqual);
  const refreshing = useSelector(state => state.events.refreshing);
  const error = useSelector(state => state.events.error);
  const locationEnabled = useSelector(state => state.permissions.location);
  const dispatch = useDispatch();
  const onRefresh = useCallback(() => dispatch(refresh()), []);
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
      } else if (ANDROID) {
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
          <React.Fragment>
            <Helmet>
              <title>Buncha</title>
            </Helmet>
            <ScrollView
              style={styles.list}
              contentContainerStyle={[styles.listContent, { paddingTop: 48 }]}
            >
              {/* <AppBanner /> */}
              <TagList
                contentContainerStyle={{
                  paddingRight:
                    Math.max((width - 900) / 2, 0) +
                    (width < medium ? 16 : 20) -
                    8,
                  paddingLeft:
                    Math.max((width - 900) / 2, 0) + (width < medium ? 16 : 20)
                }}
                style={{
                  marginVertical: 10,
                  width: "100%"
                }}
              />
              {error ? (
                <ListError />
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    paddingHorizontal: width < medium ? 8 : 10,
                    width: "100%",
                    maxWidth: 900,
                    alignSelf: "center"
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
            <MapView />
            <EventList />
            {refreshing ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : null}
            <RefreshButton />
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
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#f2f2f2",
        paddingHorizontal: WEB ? 20 : itemMargin / 2,
        paddingTop: 10,
        paddingBottom: 60,
        width: "100%",
        maxWidth: 900,
        alignSelf: "center"
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
    alignSelf: "center"
  },
  list: {
    backgroundColor: "#fff",
    flex: 1
  },
  listContent: {
    backgroundColor: "#fff",
    width: "100%",
    minHeight: "100%"
  }
});
