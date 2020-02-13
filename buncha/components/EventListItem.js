import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "../screens";
import ImageGallery from "./ImageGallery";
import { useEveryMinute } from "../utils/Hooks";
import DaysText from "./DaysText";
import { ANDROID } from "../utils/Constants";
import {
  itemRemaining,
  itemRemainingAtTime,
  itemTimeForDay
} from "../utils/Time";

export default ({ item, index, width }) => {
  const dispatch = useDispatch();
  const day = useSelector(state => state.events.day);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  const [currentTime] = useEveryMinute();
  const onPress = () => {
    navigate("Detail", { id: item._id });
  };

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
    <View
      style={{
        width,
        backgroundColor: "#fff"
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          padding: 7
        }}
        onPress={onPress}
      >
        <View style={{ height: 54, borderRadius: 2, overflow: "hidden" }}>
          <ImageGallery
            photos={item._source.photos}
            height={54}
            width={width}
          />
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
            marginTop: 1.5,
            fontWeight: "700",
            fontSize: 14
          }}
        >
          {time.duration}
          <Text style={{ fontSize: 8, fontWeight: "700", color: "#666" }}>
            {" "}
            {time.ending ? time.end : time.start}
            {time.upcoming || time.ending ? null : ` ${time.day}`}
          </Text>
        </Text>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#000"
          }}
        >
          {item._source.location}
        </Text>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#555"
          }}
        >
          {item._source.title}
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={6}
          style={{
            marginVertical: 1.5,
            fontSize: 13,
            fontWeight: "500",
            color: "#777"
          }}
        >
          {item._source.description}
        </Text>
        <DaysText days={item._source.days} />
      </TouchableOpacity>
    </View>
  );
};
