import React from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { selectPlaceEvents } from "../store/events";
import { itemRemaining } from "../utils/Time";
import { roundedDistanceTo } from "../utils/Locate";

export default ({ item, index }) => {
  const events = useSelector(selectPlaceEvents(item));
  const distance = roundedDistanceTo(events[0]);
  return (
    <View style={[styles.container]}>
      <Text style={styles.titleText}>
        {item._source.location}
        <Text style={{ color: "#666" }}> {distance}</Text>
      </Text>
      {events.map((e, index) => {
        const time = itemRemaining(e);
        return (
          <View
            key={`${index}`}
            style={{
              borderTopWidth: 1,
              borderColor: "#f2f2f2",
              marginTop: 5,
              paddingTop: 2
            }}
          >
            <Text style={{ fontSize: 12, marginTop: 2, color: "#000" }}>
              {e._source.title}{" "}
              <Text style={{ color: time.color, fontWeight: "600" }}>
                {time.text}
              </Text>
            </Text>
            <Text style={{ fontSize: 12, marginTop: 2, color: "#555" }}>
              {time.span}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  titleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000"
  }
});
