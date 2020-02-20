import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { itemRemaining } from "../utils/Time";
import { useEveryMinute } from "../utils/Hooks";
import { useSelector } from "react-redux";
import { ANDROID } from "../utils/Constants";
import MatchableText from "./MatchableText";
import EventActions from "./EventActions";

export default memo(({ item }) => {
  const [currentTime] = useEveryMinute();

  const time = itemRemaining(item);

  const searchTerm = useSelector(state =>
    state.events.text.length
      ? state.events.text
          .split(" ")
          .map(text => text.trim())
          .filter(text => text.length)
      : state.events.tag
  );

  return (
    <View style={{ margin: 7 }}>
      <Text
        numberOfLines={1}
        lineBreakMode="clip"
        allowFontScaling={false}
        style={{
          color: time.color,
          marginTop: 2,
          fontWeight: "700",
          fontSize: 15
        }}
      >
        {time.status}
        <Text
          style={{
            fontSize: 13,
            fontWeight: ANDROID ? "700" : "600",
            color: "#888"
          }}
        >
          {" "}
          {time.ending ? time.end : time.start}
          {time.upcoming || time.ending ? null : ` ${time.day}`}
        </Text>
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#000"
        }}
      >
        {item._source.title}
      </Text>
      <MatchableText
        allowFontScaling={false}
        style={{
          marginTop: 6,
          fontSize: 15,
          color: "#444",
          fontWeight: "500",
          maxWidth: 270,
          lineHeight: 22
        }}
        text={item._source.description}
        match={searchTerm}
      />
      <EventActions item={item} />
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
    fontWeight: ANDROID ? "700" : "600",
    color: "#000"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  titleText: {
    fontSize: 16,
    fontWeight: ANDROID ? "700" : "600"
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
