import React from "react";
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
import { FontAwesome } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";
import { useEveryMinute, useAnimateOn } from "../utils/Hooks";

let tabBarHeight = 0;
if (!WEB) {
  tabBarHeight = require("./TabBar").tabBarHeight;
}

const Item = ({ item, index }) => {
  const [currentTime] = useEveryMinute();
  const events = useSelector(selectPlaceEvents(item));
  const distance = roundedDistanceTo(events[0]);
  const time = itemRemaining(events[0]);
  const eventsText = `${events.length} event${events.length != 1 ? "s" : ""}`;
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          emitter.emit("select-marker", item._id);
        }}
      >
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={styles.locationText}>
            {item._source.location}
          </Text>
          <Text style={{ fontSize: 10, color: "#666" }}>
            <Text style={{ color: time.color, fontWeight: "600" }}>
              {time.text}
            </Text>{" "}
            {eventsText}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={[styles.locationText, { color: "#666" }]}>
            {distance}
          </Text>
          <View style={styles.rating}>
            <FontAwesome name="star" size={14} color="#FFA033" />
            <Text style={styles.ratingText}>
              {parseFloat(events[0]._source.rating, 10).toFixed(1)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default () => {
  const data = useSelector(state =>
    state.events.markers.sort((a, b) => a._source.location > b._source.location)
  );

  const selectedEvent = useSelector(state => {
    const selected = state.events.selected;
    if (!selected) {
      return null;
    }
    return state.events.data[selected];
  });

  const [, transform] = useAnimateOn(selectedEvent);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: transform.current.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          })
        }
      ]}
    >
      <FlatList
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
    height: 72,
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
    paddingHorizontal: 8,
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
    marginLeft: 5
  }
});
