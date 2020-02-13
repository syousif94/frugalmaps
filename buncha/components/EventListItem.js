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
        marginBottom: 2.5,
        marginHorizontal: 2.5,
        backgroundColor: "#fff",
        borderRadius: 4
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          padding: 5
        }}
        onPress={onPress}
      >
        <View style={{ height: 54, borderRadius: 2, overflow: "hidden" }}>
          <ImageGallery
            photos={item._source.photos}
            height={54}
            width={width - 10}
          />
        </View>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#000",
            marginTop: 2
          }}
        >
          {item._source.location}
        </Text>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            marginTop: ANDROID ? -2 : -1,
            marginBottom: 1.5,
            fontSize: 13,
            fontWeight: "600",
            color: "#000"
          }}
        >
          {item._source.title}
        </Text>
        <Text
          numberOfLines={1}
          lineBreakMode="clip"
          allowFontScaling={false}
          style={{
            color: time.color,
            fontWeight: "700",
            fontSize: 10
          }}
        >
          <DaysText days={item._source.days} /> {time.duration}
        </Text>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            color: "#666",
            fontWeight: "700",
            fontSize: 13,
            marginTop: 0.5
          }}
        >
          {time.start} - {time.end}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
