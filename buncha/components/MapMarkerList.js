import React, { useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import {
  itemRemaining,
  itemTimeForDay,
  itemRemainingAtTime
} from "../utils/Time";
import { WEB } from "../utils/Constants";
import { roundedDistanceTo } from "../utils/Locate";
import emitter from "tiny-emitter/instance";
import { useEveryMinute, useKeyboardHeight } from "../utils/Hooks";
import PriceText from "./PriceText";

let tabBarHeight = 0;
if (!WEB) {
  tabBarHeight = require("./TabBar").tabBarHeight;
}

const Item = ({ item, index }) => {
  const [currentTime] = useEveryMinute();
  const day = useSelector(state => state.events.day);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  const distance = roundedDistanceTo(item);
  let time;

  if (notNow) {
    if (day) {
      time = itemTimeForDay(item, day);
    } else {
      time = itemRemainingAtTime(item, now);
    }
  } else {
    time = itemRemaining(item);
  }
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
          <Text numberOfLines={1} style={styles.itemText}>
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
          <Text style={[styles.itemText, { color: "#666" }]}>{distance}</Text>
          <PriceText
            priceLevel={item._source.priceLevel}
            style={{ fontSize: 11, fontWeight: "700" }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ({ offset }) => {
  const listRef = useRef(null);
  const data = useSelector(state => state.events.upNext, shallowEqual);

  const [keyboardHeight, bottomOffset] = useKeyboardHeight(
    -tabBarHeight - offset
  );

  useEffect(() => {
    bottomOffset.current = -tabBarHeight - offset;
  }, [offset]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
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
  container: {},
  list: {},
  listContent: {
    paddingVertical: 4
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
    paddingTop: 5,
    paddingLeft: 8,
    paddingBottom: 5,
    flex: 1,
    overflow: "hidden"
  },
  locationText: {
    textTransform: "uppercase",
    fontSize: 9,
    fontWeight: "700",
    color: "#555",
    marginBottom: 1
  },
  itemText: {
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
