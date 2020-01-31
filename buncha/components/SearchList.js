import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useDimensions } from "../utils/Hooks";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Fuse from "fuse.js";
import emitter from "tiny-emitter/instance";
import { useSafeArea } from "react-native-safe-area-context";
import { itemMargin } from "./UpNextItem";
import * as Events from "../store/events";

export default () => {
  const listRef = useRef(null);
  const [dimensions] = useDimensions();
  const [filter, setFilter, data] = useSearch();
  const insets = useSafeArea();

  useEffect(() => {
    const onScrollEnabled = scrollEnabled => {
      listRef.current.setNativeProps({ scrollEnabled });
    };

    emitter.on("scroll-enabled", onScrollEnabled);

    return () => {
      emitter.off("scroll-enabled", onScrollEnabled);
    };
  }, []);
  return (
    <View style={[styles.container, { width: dimensions.width }]}>
      <FlatList
        ref={listRef}
        nestedScrollEnabled
        scrollEnabled={false}
        contentContainerStyle={{
          paddingTop: 40 + 12 + 2 + 10,
          paddingBottom: insets.bottom
        }}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        style={{ flex: 1 }}
        data={data}
        keyExtractor={item => `${item.type}${item.text}`}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              marginLeft: itemMargin,
              backgroundColor: "#f4f4f4"
            }}
          />
        )}
        renderItem={data => <SearchItem {...data} />}
      />
    </View>
  );
};

const SearchItem = ({ item, index }) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: itemMargin,
        flexDirection: "row",
        alignItems: "baseline",
        paddingVertical: 10
      }}
      onPress={() => {
        switch (item.type) {
          case "city":
            dispatch(Events.getCity(item.city));
            emitter.emit("toggle-panel", false);
          // emitter.emit("page-lists", 3);
          case "tag":
            emitter.emit("page-lists", item.text);
          default:
            break;
        }
      }}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 16,
          fontWeight: "600"
        }}
      >
        {item.text}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          marginLeft: 6,
          fontSize: 16,
          fontWeight: "600",
          color: "#777"
        }}
      >
        {item.type}
      </Text>
      <View style={{ flex: 1 }} />
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#777"
        }}
      >
        {getTagCount(item)}
      </Text>
    </TouchableOpacity>
  );
};

function getTagCount(tag) {
  switch (tag.type) {
    case "city":
      return tag.city._source.count;
    case "tag":
      return tag.tag.count;
    case "place":
      return tag.events.length;
    default:
      return null;
  }
}

function useSearch() {
  const [filter, setFilter] = useState("");
  const items = useRef([]);
  const fuseRef = useRef(null);
  const [list, setList] = useState([]);

  const tags = useSelector(state => state.events.tags, shallowEqual);
  const cities = useSelector(state => state.cities.closest, shallowEqual);
  const places = useSelector(state => state.events.places, shallowEqual);
  const data = useSelector(state => state.events.data, shallowEqual);

  useEffect(() => {
    items.current = [
      ...tags.map(tag => {
        return {
          type: "tag",
          text: tag.text,
          tag
        };
      }),
      ...cities.map(city => {
        return {
          type: "city",
          text: city._source.name,
          city
        };
      }),
      ...Object.values(places).map(keys => {
        const events = keys.map(key => data[key]);
        return {
          type: "place",
          text: events[0]._source.location,
          events
        };
      })
    ].sort((a, b) => {
      const aText = a.text.toLowerCase();
      const bText = b.text.toLowerCase();
      if (aText < bText) {
        return -1;
      }
      if (aText > bText) {
        return 1;
      }
      return 0;
    });

    setList(items.current);

    fuseRef.current = new Fuse(items.current, {
      caseSensitive: false,
      shouldSort: true,
      findAllMatches: false,
      includeMatches: true,
      threshold: 0.3,
      distance: 20,
      keys: ["text"]
    });
  }, [tags, cities, places, data]);

  useEffect(() => {
    if (!filter || !filter.length) {
      setList(items.current);
    } else if (fuseRef.current) {
      setList(fuseRef.current.search(filter));
    }
  }, [filter]);

  return [filter, setFilter, list];
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
