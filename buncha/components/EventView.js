import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { itemRemaining } from "../utils/Time";
import { RED, BLUE, UPCOMING } from "../utils/Colors";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import EventFriends from "./EventFriends";

export default ({ item, index = 0, style, description, demo }) => {
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
    <View style={[{ overflow: "hidden" }, style]}>
      <View
        style={[styles.row, { alignItems: "flex-start", paddingHorizontal: 5 }]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.titleText}>{item._source.title}</Text>
          <Text style={styles.subtitleText}>
            {time.span}
            <Text
              style={{ color: time.color, fontSize: 10, fontWeight: "700" }}
            >
              {" "}
              {time.text}
            </Text>
          </Text>
          {description ? (
            <Text style={styles.descriptionText}>
              {item._source.description}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <TouchableOpacity style={styles.actionButton}>
          <Entypo name="calendar" size={16} color={RED} />
          <Text style={styles.actionText}>Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton]}>
          <FontAwesome name="star" size={16} color={"#FFA033"} />
          <Text style={styles.actionText}>Interested</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton]}>
          <Feather name="share" size={16} color={BLUE} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    height: 38,
    marginHorizontal: 5,
    paddingRight: 10
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
  subtitleText: {
    marginTop: 2,
    fontSize: 12,
    color: "#666",
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
  },
  timeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600"
  }
});
