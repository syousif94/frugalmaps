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
import TopBar from "../components/TopBar";
import { enableLocation } from "../store/permissions";
import { WEB } from "../utils/Constants";
import { getHistory } from ".";
import { Helmet } from "react-helmet";
import SortBar from "../components/SortBar";
import SearchPanel from "../components/SearchPanel";
import { useCitiesToggle } from "../utils/Hooks";
import AppBanner from "../components/AppBanner";
import ListError from "../components/ListError";

export default () => {
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
      {!WEB ? (
        <TopBar rotate={citiesTranslate.current} toggle={toggleCities} />
      ) : null}
      {WEB ? (
        <ScrollView
          ref={listRef}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            {
              borderLeftWidth: width > 902 ? 1 : null,
              borderRightWidth: width > 902 ? 1 : null
            }
          ]}
        >
          <AppBanner />
          <TopBar
            rotate={citiesTranslate.current}
            toggle={toggleCities}
            style={{ paddingHorizontal: width > 600 ? 25 : 10 }}
          />
          {error ? (
            <ListError />
          ) : (
            <React.Fragment>
              <SortBar />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  paddingHorizontal: width > 600 ? 10 : null
                }}
              >
                {data.map((item, index) => (
                  <View
                    style={{
                      width:
                        width > 900 ? "33.33%" : width > 600 ? "50%" : "100%",
                      paddingHorizontal: width > 600 ? 10 : null,
                      paddingLeft: width <= 600 ? 10 : null,
                      paddingVertical: width > 600 ? 10 : null
                    }}
                    key={item._id}
                  >
                    <Item item={item} index={index} />
                    {width <= 600 ? <View style={styles.separator} /> : null}
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
              return <Item {...data} photosOnTop />;
            }}
            contentContainerStyle={styles.listContent}
            data={data}
            style={styles.list}
            contentInsetAdjustmentBehavior="never"
            keyExtractor={item => item._id}
            refreshing={refreshing}
            onRefresh={refresh}
            ListHeaderComponent={() => <SortBar />}
            ListFooterComponent={() => (data.length ? <ListFooter /> : null)}
            ListEmptyComponent={() => (error ? <ListError /> : null)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <SearchPanel
            translateY={citiesTranslate.current}
            toggle={toggleCities}
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
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#f2f2f2",
        paddingHorizontal: 10,
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
    maxWidth: WEB ? 902 : null,
    alignSelf: WEB ? "center" : "stretch"
  },
  separator: {
    marginBottom: WEB ? null : 10,
    marginTop: WEB ? 10 : null,
    height: 1,
    backgroundColor: "#f2f2f2"
  }
});
