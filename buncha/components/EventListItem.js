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
import { AWSCF } from "../utils/Constants";

export const PADDING = 4;

const TIME_STYLES = [
  {
    fontSize: 17,
    fontWeight: "700",
    color: "#444"
  },
  {
    fontSize: 14,
    fontWeight: "700",
    color: "#777"
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
        paddingBottom: PADDING * 2,
        paddingHorizontal: PADDING * 2,
        paddingTop: index ? PADDING * 2 : 0,
        flexDirection: "row"
      }}
      to={`e/${item._id}`}
      onPress={onPress}
    >
      <View style={{ flex: 1, paddingBottom: 2 }}>
        <Text
          allowFontScaling={false}
          style={{
            color: time.color,
            fontWeight: "700",
            fontSize: 17
          }}
        >
          {time.status}{" "}
          <Text style={time.ending ? TIME_STYLES[1] : TIME_STYLES[0]}>
            {time.start}
            {time.upcoming || time.ending ? null : ` ${time.day}`}
          </Text>
          <Text style={time.ending ? TIME_STYLES[0] : TIME_STYLES[1]}>
            {" "}
            til {time.end}
          </Text>
        </Text>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            fontSize: 18,
            fontWeight: "700",
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
              fontSize: 13,
              fontWeight: "500",
              color: "#555",
              marginTop: -0.5
            }}
          >
            {item._source.neighborhood}
          </Text>
        ) : null}
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#000",
            marginTop: 0.5
          }}
          numberOfLines={1}
        >
          {item._source.title}
        </Text>

        <Text
          allowFontScaling={false}
          style={{
            marginTop: 1,
            color: "#555",
            fontSize: 18,
            fontWeight: "500"
          }}
          numberOfLines={3}
        >
          {item._source.description}
        </Text>
        {item._source.website ? <WebsiteText item={item} /> : null}
      </View>
      <View
        style={{
          marginTop: index ? 4 : 2,
          marginLeft: 10
        }}
      >
        <View
          style={{
            height: 100,
            width: 90,

            borderRadius: 3,
            overflow: "hidden"
          }}
        >
          <PhotoView photos={item._source.photos} key={item._id} />
          <View
            style={{
              position: "absolute",
              top: 3,
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
        <EventActions item={item} />
      </View>
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

  return <Image source={source} style={{ flex: 1 }} resizeMode="cover" />;
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
