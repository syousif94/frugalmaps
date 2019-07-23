import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { itemRemaining } from "../utils/Time";
import { RED, BLUE, UPCOMING } from "../utils/Colors";
import { Entypo, EvilIcons } from "@expo/vector-icons";
import EventFriends from "./EventFriends";

export default ({ item, index = 0, style, demo }) => {
  let time;
  if (demo) {
    time = {
      color: UPCOMING,
      text: "in 40 minutes",
      span: "Mon 7pm - 9:30pm"
    };
  } else {
    time = itemRemaining(item);
  }

  return (
    <View style={{ overflow: "hidden" }}>
      <View style={[styles.row, { alignItems: "flex-start" }, style]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailText}>{time.span}</Text>
          <Text style={styles.titleText}>
            {index + 1}. {item._source.title}
            <Text style={{ color: time.color }}> {time.text}</Text>
          </Text>

          <Text style={[styles.descriptionText]}>
            {item._source.description}
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <TouchableOpacity style={styles.actionButton}>
            <Entypo name="calendar" size={16} color={RED} />
            <Text style={styles.actionText}>Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { marginTop: 8 }]}>
            <EvilIcons
              style={{ marginRight: -7 }}
              name="like"
              size={25}
              color={BLUE}
            />
            <Text style={styles.actionText}>Down</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={{ marginTop: 5, maxWidth: "100%" }}>
        <EventFriends />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 24
  },
  actionText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  titleText: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "600"
  },
  detailText: {
    fontSize: 12,
    color: "#444"
  },
  descriptionText: {
    marginTop: 7,
    color: "#000",
    fontSize: 14
  }
});
