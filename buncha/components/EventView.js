import React, { useMemo, memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { itemRemaining } from "../utils/Time";
import { RED, BLUE, UPCOMING } from "../utils/Colors";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import EventFriends from "./EventFriends";
import share from "../utils/Share";

export default memo(({ item, index = 0, style, description, demo }) => {
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
          <Text style={[styles.subtitleText]}>{time.span}</Text>
          <View style={styles.row}>
            <Text style={styles.titleText}>
              {item._source.title}
              <Text style={{ color: time.color, fontWeight: "700" }}>
                {" "}
                {time.text} {time.state}
              </Text>
            </Text>
          </View>

          {description ? (
            <Text style={styles.descriptionText}>
              {item._source.description}
            </Text>
          ) : (
            <Text style={styles.tagText}>{item._source.tags.join(", ")}</Text>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5
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
        <TouchableOpacity
          style={[styles.actionButton]}
          onPress={share.bind(null, item)}
        >
          <Feather name="share" size={16} color={BLUE} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ marginTop: 5, maxWidth: "100%" }}>
        <EventFriends />
      </View> */}
    </View>
  );
});

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
    marginTop: 2,
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
    fontSize: 14
  },
  tagText: {
    marginTop: 3,
    color: "#666",
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase"
  },
  timeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600"
  }
});
