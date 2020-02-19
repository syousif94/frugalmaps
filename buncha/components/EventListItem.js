import React from "react";
import { Text, View, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { navigate } from "../screens";
import ImageGallery from "./ImageGallery";
import { useEveryMinute } from "../utils/Hooks";
import DaysText from "./DaysText";
import {
  itemRemaining,
  itemRemainingAtTime,
  itemTimeForDay
} from "../utils/Time";
import MatchableText from "./MatchableText";
import { roundedDistanceTo } from "../utils/Locate";
import { ANDROID, WEB } from "../utils/Constants";
import Link from "./Link";
import emitter from "tiny-emitter/instance";
import EventActions from "./EventActions";

export const PADDING = 6;

export default ({ item, index, width }) => {
  const day = useSelector(state => state.events.day);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  const [currentTime] = useEveryMinute();
  const searchTerm = useSelector(state =>
    state.events.text.length
      ? state.events.text
          .split(" ")
          .map(text => text.trim())
          .filter(text => text.length)
      : state.events.tag
  );
  const onPress = () => {
    navigate("Detail", { id: item._id });
    if (WEB && Dimensions.get("window").width > 850) {
      emitter.emit("select-marker", item);
    }
  };

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
    <Link
      style={{
        width,
        backgroundColor: "#fff",
        padding: PADDING
      }}
      to={`e/${item._id}`}
      onPress={onPress}
    >
      <View style={{ height: 54, borderRadius: 2, overflow: "hidden" }}>
        <ImageGallery photos={item._source.photos} height={54} width={width} />
        <View
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 2,
            paddingHorizontal: 2
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {index + 1}
          </Text>
        </View>
      </View>
      <Text
        numberOfLines={1}
        lineBreakMode="clip"
        allowFontScaling={false}
        style={{
          color: time.color,
          marginTop: 2,
          fontWeight: "700",
          fontSize: 13
        }}
      >
        {time.duration}
        <Text
          style={{
            fontSize: 11,
            fontWeight: ANDROID ? "700" : "600",
            color: "#555"
          }}
        >
          {" "}
          {time.ending ? time.end : time.start}
          {time.upcoming || time.ending ? null : ` ${time.day}`}
        </Text>
      </Text>
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: "#000"
        }}
      >
        {item._source.location}
      </Text>
      {item._source.neighborhood ? (
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: "#555"
          }}
        >
          {item._source.neighborhood.split(",")[0]}
        </Text>
      ) : null}

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#000"
        }}
      >
        {item._source.title}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: "#555"
        }}
        allowFontScaling={false}
      >
        <DaysText days={item._source.days} />
        {distance ? ` · ${distance}` : null}
      </Text>
      <MatchableText
        allowFontScaling={false}
        numberOfLines={6}
        style={{
          marginTop: 1.5,
          fontSize: 13,
          color: "#000"
        }}
        text={item._source.description}
        match={searchTerm}
      />
      <Text
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: "#999"
        }}
        allowFontScaling={false}
      >
        {item._source.tags.join(", ")}
      </Text>
      <EventActions item={item} />
    </Link>
  );
};
