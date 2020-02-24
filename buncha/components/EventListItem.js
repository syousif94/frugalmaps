import React, { useRef } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../screens";
import ImageGallery from "./ImageGallery";
import { useEveryMinute } from "../utils/Hooks";
import {
  itemRemaining,
  itemRemainingAtTime,
  itemTimeForDay
} from "../utils/Time";
import MatchableText from "./MatchableText";
import { roundedDistanceTo } from "../utils/Locate";
import { ANDROID, WEB, IOS } from "../utils/Constants";
import Link from "./Link";
import emitter from "tiny-emitter/instance";
import EventActions from "./EventActions";
import PriceText from "./PriceText";
import { BLUE } from "../utils/Colors";
import * as Browser from "../store/browser";

export const PADDING = 5;

const TIME_STYLES = [
  {
    fontSize: 10,
    fontWeight: "700",
    color: "#555"
  },
  {
    fontSize: 9,
    fontWeight: "700",
    color: "#aaa"
  }
];

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
      <View style={{ height: 54, borderRadius: 3, overflow: "hidden" }}>
        <ImageGallery photos={item._source.photos} height={54} width={width} />
        <View
          style={{
            position: "absolute",
            bottom: 3,
            left: 3,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 3,
            paddingHorizontal: 3
          }}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
            {index + 1}
          </Text>
        </View>
      </View>
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#000",
          marginTop: 2,
          marginBottom: -1
        }}
      >
        {item._source.location}
      </Text>
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontSize: 10,
          fontWeight: "600",
          color: "#555"
        }}
      >
        {item._source.neighborhood || item._source.address}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: "#000"
        }}
      >
        {item._source.title}{" "}
        <Text
          allowFontScaling={false}
          style={{
            color: time.color,
            fontWeight: "700",
            fontSize: 11
          }}
        >
          {time.status}
          <Text style={time.ending ? TIME_STYLES[1] : TIME_STYLES[0]}>
            {" "}
            {time.start}
            {time.upcoming || time.ending ? null : ` ${time.day}`}
          </Text>
          <Text style={time.ending ? TIME_STYLES[0] : TIME_STYLES[1]}>
            {" "}
            til {time.end}
          </Text>
        </Text>
      </Text>
      <MatchableText
        allowFontScaling={false}
        style={{
          fontSize: 14,
          color: "#000",
          fontWeight: "400"
        }}
        numberOfLines={4}
        text={item._source.description}
        match={searchTerm}
      />
      {!item._source.website ? null : <WebsiteText item={item} />}

      {/* <Text
        style={{
          fontSize: 11,
          fontWeight: ANDROID ? "700" : "600",
          color: "#999"
        }}
        allowFontScaling={false}
      >
        {item._source.tags.join(", ")}
      </Text> */}
      <EventActions item={item} />
    </Link>
  );
};

const WebsiteText = ({ item }) => {
  const dispatch = useDispatch();
  const opacity = useRef(new Animated.Value(1));

  const webtext = item._source.website
    .replace(/((http|https):\/\/|www.)/gi, "")
    .split("/")[0];

  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        opacity.current.setValue(0.3);
      }}
      onPressOut={() => {
        opacity.current.setValue(1);
      }}
      onPress={() => {
        if (WEB) {
          window.open(item._source.website, "_blank");
        } else {
          dispatch({
            type: "browser/set",
            payload: {
              url: item._source.website,
              mode: Browser.MODES[0]
            }
          });
        }
      }}
    >
      <Animated.Text
        allowFontScaling={false}
        style={{
          opacity: opacity.current,
          textDecoration: "underline",
          textDecorationLine: "underline",
          fontSize: 13,
          fontWeight: "400",
          color: "#8DA9C1"
        }}
      >
        {webtext}
      </Animated.Text>
    </TouchableWithoutFeedback>
  );
};
