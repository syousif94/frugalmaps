import React, { useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import { useSelector } from "react-redux";
import { selectPlaceEvents } from "../store/events";
import { itemRemaining } from "../utils/Time";
import { WEB } from "../utils/Constants";
import { roundedDistanceTo } from "../utils/Locate";
import emitter from "tiny-emitter/instance";
import {
  useEveryMinute,
  useAnimateOn,
  useKeyboardHeight
} from "../utils/Hooks";
import PriceText from "./PriceText";

let tabBarHeight = 0;
if (!WEB) {
  tabBarHeight = require("./TabBar").tabBarHeight;
}

const Item = ({ item, index }) => {
  const [currentTime] = useEveryMinute();
  const events = useSelector(selectPlaceEvents(item));
  const distance = roundedDistanceTo(item);
  const time = itemRemaining(item);
  const eventsText = `${events.length} event${events.length != 1 ? "s" : ""}`;
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          emitter.emit("select-marker", item._source.placeid);
        }}
      >
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.locationText}>
            {item._source.location}
          </Text>
          <Text numberOfLines={1} style={styles.locationText}>
            {item._source.title}
          </Text>
          <Text
            style={{ fontSize: 10, color: time.color, fontWeight: "600" }}
            numberOfLines={1}
          >
            {time.text}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 8,
            marginTop: 5
          }}
        >
          <Text style={[styles.locationText, { color: "#666" }]}>
            {distance}
          </Text>
          <PriceText
            priceLevel={item._source.priceLevel}
            style={{ fontSize: 11, fontWeight: "700" }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default () => {
  const listRef = useRef(null);
  const data = useSelector(state => state.events.upNext);

  const selectedEvent = useSelector(state => {
    const selected = state.events.selected;
    if (!selected) {
      return null;
    }
    return state.events.data[selected];
  });

  const [keyboardHeight] = useKeyboardHeight(-tabBarHeight);

  const [, transform] = useAnimateOn(selectedEvent);

  useEffect(() => {
    listRef.current.scrollToOffset({
      animated: false,
      offset: 0
    });
  }, [data]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: transform.current.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
          transform: [{ translateY: keyboardHeight.current }]
        }
      ]}
    >
      <FlatList
        ref={listRef}
        data={data}
        renderItem={data => <Item {...data} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        horizontal
        contentInsetAdjustmentBehavior="never"
        keyExtractor={item => item._id}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: tabBarHeight,
    right: 0,
    left: 0
  },
  list: {},
  listContent: {
    padding: 4
  },
  item: {
    margin: 4,
    width: 105,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  button: {
    paddingTop: 7,
    paddingLeft: 8,
    paddingBottom: 5,
    flex: 1,
    overflow: "hidden"
  },
  locationText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#000"
  },
  rating: {
    flexDirection: "row",
    alignItems: "center"
  },
  ratingText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 3
  }
});
