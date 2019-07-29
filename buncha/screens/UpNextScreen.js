import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Text
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
import CityList from "../components/CityList";
import { useCitiesToggle } from "../utils/Hooks";

export default () => {
  const data = useSelector(state => state.events.upNext);
  const refreshing = useSelector(state => state.events.refreshing);
  const locationEnabled = useSelector(state => state.permissions.location);
  const dispatch = useDispatch();
  const refresh = useCallback(() => dispatch(get()), []);
  const listRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (WEB) {
      const history = getHistory();

      const unlisten = history.listen(location => {
        const home = location.pathname === "/";
        setOpacity(home ? 1 : 0);
        if (home && !data.length && !refreshing) {
          refresh();
          dispatch(Cities.get());
        }
      });

      return () => unlisten();
    }
  }, [data, refreshing]);

  useEffect(() => {
    if (locationEnabled === null) {
      return;
    }

    if (!WEB && !data.length && !refreshing) {
      refresh();
      dispatch(Cities.get());
    } else if (WEB) {
      const history = getHistory();
      if (history.location.pathname === "/" && !data.length && !refreshing) {
        setOpacity(1);
        refresh();
        dispatch(Cities.get());
      }
    }
  }, [locationEnabled, data, refreshing]);

  useEffect(() => {
    dispatch(enableLocation());
  }, []);

  // useLayoutEffect(() => {
  //   if (WEB) {
  //     const history = getHistory();
  //     if (history) {
  //       const key = history.location.key;
  //       const yOffset = window.sessionStorage[key];
  //       if (yOffset && listRef.current) {
  //         listRef.current.scrollTo({ y: yOffset, animated: false });
  //       }
  //     }
  //   }
  // }, []);

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
          contentContainerStyle={styles.listContent}
          // onScroll={e => {
          //   const key = getHistory().location.key;
          //   window.sessionStorage.setItem(key, e.nativeEvent.contentOffset.y);
          // }}
          // scrollEventThrottle={16}
        >
          <TopBar rotate={citiesTranslate.current} toggle={toggleCities} />
          {data.map((item, index) => (
            <React.Fragment key={item._id}>
              {index !== 0 ? <View style={styles.separator} /> : null}
              <Item item={item} index={index} />
            </React.Fragment>
          ))}
          {data.length ? <ListFooter /> : null}
        </ScrollView>
      ) : (
        <View style={styles.list}>
          <FlatList
            ref={listRef}
            renderItem={data => {
              return <Item {...data} />;
            }}
            contentContainerStyle={styles.listContent}
            data={data}
            style={styles.list}
            contentInsetAdjustmentBehavior="never"
            keyExtractor={item => item._id}
            refreshing={refreshing}
            onRefresh={refresh}
            ListFooterComponent={() => (data.length ? <ListFooter /> : null)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <CityList
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
    maxWidth: WEB ? 500 : null,
    alignSelf: WEB ? "center" : "stretch"
  },
  separator: {
    height: 1,
    marginLeft: 5,
    backgroundColor: "#f2f2f2"
  }
});
