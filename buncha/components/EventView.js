import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { itemRemaining } from "../utils/Time";
import { RED } from "../utils/Colors";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import EventFriends from "./EventFriends";
import share from "../utils/Share";
import { useEveryMinute, useDimensions } from "../utils/Hooks";
import { navigate } from "../screens";
import DaysText from "./DaysText";
import { useDispatch } from "react-redux";
import * as Interested from "../store/interested";

export default memo(({ item, index = 0, style }) => {
  const dispatch = useDispatch();
  const [currentTime] = useEveryMinute();
  const [dimensions] = useDimensions();

  const time = itemRemaining(item);

  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <DaysText days={item._source.days} />

      <Text style={[styles.titleText, { marginTop: 4 }]}>
        {item._source.title}{" "}
        <Text style={{ color: time.color, fontWeight: "700" }}>
          {time.text}
        </Text>
        <Text style={styles.subText}> {time.duration}</Text>
      </Text>

      <Text
        style={[
          styles.descriptionText,
          { maxWidth: dimensions.width < 800 ? "90%" : 280 }
        ]}
      >
        {item._source.description}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(Interested.show({ event: item }));
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
    </View>
  );
});

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
    height: 32,
    marginRight: 5,
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
    fontWeight: "600"
  },
  descriptionText: {
    color: "#000",
    marginTop: 5,
    fontSize: 17,
    lineHeight: 24,
    color: "#444"
  },
  subText: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "700"
  }
});
