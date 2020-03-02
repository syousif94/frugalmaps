import React, { useRef, memo } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Image
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../screens";
import { useEveryMinute } from "../utils/Hooks";
import {
  itemRemaining,
  itemRemainingAtTime,
  itemTimeForDay
} from "../utils/Time";
import MatchableText from "./MatchableText";
import { roundedDistanceTo } from "../utils/Locate";
import { WEB } from "../utils/Constants";
import Link from "./Link";
import emitter from "tiny-emitter/instance";
import EventActions from "./EventActions";
import * as Browser from "../store/browser";
import { AWSCF } from "../utils/Constants";

export const PADDING = WEB ? 5 : 4;

const TIME_STYLES = [
  {
    fontSize: 15,
    fontWeight: "700",
    color: "#666"
  },
  {
    fontSize: 13,
    fontWeight: "700",
    color: "#999"
  }
];

const Item = ({ item, index, width }) => {
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
        padding: PADDING,
        paddingTop: WEB ? 0 : PADDING
      }}
      to={`e/${item._id}`}
      onPress={onPress}
    >
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontSize: 15,
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
          fontSize: 10,
          fontWeight: "500",
          color: "#555",
          marginTop: -1
        }}
      >
        {distance ? `${distance} · ` : null}
        {item._source.neighborhood || item._source.address}
      </Text>
      <View
        style={{
          height: 80,
          width: width - PADDING * 2,
          borderRadius: 3,
          overflow: "hidden",
          marginVertical: 3
        }}
      >
        <PhotoView photos={item._source.photos} key={item._id} />
        <View
          style={{
            position: "absolute",
            bottom: 3,
            right: 3,
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 4
          }}
        >
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "700" }}>
            {index + 1}
          </Text>
        </View>
      </View>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: "#000"
        }}
      >
        {item._source.title}
        <Text style={time.ending ? TIME_STYLES[1] : TIME_STYLES[0]}>
          {" "}
          {time.start}
          {time.upcoming || time.ending ? null : ` ${time.day}`}
        </Text>
        <Text style={time.ending ? TIME_STYLES[0] : TIME_STYLES[1]}>
          {" "}
          til {time.end}{" "}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            color: time.color,
            fontWeight: "700",
            fontSize: 15
          }}
        >
          {time.status}{" "}
        </Text>
        <MatchableText
          allowFontScaling={false}
          style={{
            color: "#555",
            fontSize: 11,
            fontWeight: "500"
          }}
          match={searchTerm}
          text={item._source.description}
        />
      </Text>
      {item._source.website ? <WebsiteText item={item} /> : null}
      <EventActions item={item} />
    </Link>
  );
};

export default Item;

const PhotoView = memo(({ photos }) => {
  const index = Math.floor(Math.random() * (photos.length - 1));
  const item = photos[index];
  const uri = `${AWSCF}${item.thumb.key}`;

  const source = {
    uri
  };

  return (
    <Image
      source={source}
      style={{ flex: 1, backgroundColor: "#f4f4f4" }}
      resizeMode="cover"
    />
  );
});

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
