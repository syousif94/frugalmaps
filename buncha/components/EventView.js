import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { itemRemaining, truncatedHours } from "../utils/Time";
import { RED } from "../utils/Colors";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import EventFriends from "./EventFriends";
import share from "../utils/Share";
import { useEveryMinute } from "../utils/Hooks";
import emitter from "tiny-emitter/instance";
import { navigate } from "../screens";

export default memo(({ item, index = 0, style }) => {
  const [currentTime] = useEveryMinute();

  const time = itemRemaining(item);

  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <View style={{ paddingHorizontal: 5, paddingTop: 2 }}>
        <Text style={styles.titleText}>
          {item._source.title}
          <Text style={{ color: time.color, fontWeight: "700" }}>
            {" "}
            {time.text}
          </Text>
          <Text style={styles.subText}> {time.duration}</Text>
        </Text>

        <Text style={styles.descriptionText}>{item._source.description}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5
        }}
      >
        <TouchableOpacity
          onPress={() => {
            emitter.emit("interested", item);
          }}
          style={styles.actionButton}
        >
          <FontAwesome name="star" size={16} color={"#FFA033"} />
          <Text style={styles.actionText}>Interested</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate("Plan", { eid: item._id });
          }}
          style={[styles.actionButton]}
        >
          <Entypo name="calendar" size={16} color={RED} />
          <Text style={styles.actionText}>Plan</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ marginTop: 5, maxWidth: "100%" }}>
        <EventFriends />
      </View> */}
    </View>
  );
});

const EventSchedule = ({ groupedHours }) => {
  const hours = groupedHours
    .reduce((prev, group) => {
      const [start, end] = truncatedHours(group);
      return prev.concat(
        group.days.map(day => {
          return {
            ...day,
            start,
            end
          };
        })
      );
    }, [])
    .sort((a, b) => {
      const aIso = a.iso || 7;
      const bIso = b.iso || 7;
      return aIso - bIso;
    });
  return (
    <View style={{ flexDirection: "row" }}>
      {hours.map(hour => {
        return (
          <View key={hour.text} style={{ marginRight: 15, marginTop: 10 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#444"
              }}
            >
              {hour.text}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginTop: 2,
                color: "#000",
                fontWeight: "500"
              }}
            >
              {hour.start}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#000",
                marginTop: 2,
                fontWeight: "500"
              }}
            >
              {hour.end}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    marginHorizontal: 5,
    paddingRight: 10
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700"
  },
  subtitleText: {
    marginTop: 2,
    fontSize: 14,
    color: "#000",
    fontWeight: "600"
  },
  detailText: {
    fontSize: 12,
    color: "#444"
  },
  descriptionText: {
    marginTop: 7,
    color: "#000",
    fontSize: 16,
    lineHeight: 22
  },
  spanText: {
    marginBottom: 5,
    color: "#666",
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase"
  },
  tagText: {
    marginTop: 5,
    color: "#666",
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase"
  },
  timeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600"
  },
  subText: { fontSize: 10, color: "#aaa", fontWeight: "700" }
});
