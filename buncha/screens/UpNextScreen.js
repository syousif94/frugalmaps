import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { refresh } from "../store/events";
import * as Cities from "../store/cities";
import { enableLocation } from "../store/permissions";
import { WEB, IOS, ANDROID } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
// import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";
import emitter from "tiny-emitter/instance";
import { InputProvider } from "../components/InputContext";
import RefreshButton from "../components/RefreshButton";
import EventList from "../components/EventList";

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
        if (home) {
          setOpacity(1);
        }
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
            <EventList />
            <RefreshButton />
          </React.Fragment>
        ) : (
          <View style={styles.list}>
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
