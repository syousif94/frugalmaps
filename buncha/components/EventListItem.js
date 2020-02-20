import React from "react";
import { Text, View, Dimensions } from "react-native";
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
import { ANDROID, WEB } from "../utils/Constants";
import Link from "./Link";
import emitter from "tiny-emitter/instance";
import EventActions from "./EventActions";
import PriceText from "./PriceText";
import { BLUE } from "../utils/Colors";
import * as Browser from "../store/browser";

export const PADDING = WEB ? 6 : 8;

export default ({ item, index, width }) => {
  const dispatch = useDispatch();
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
      <View
        style={{ height: WEB ? 54 : 110, borderRadius: 5, overflow: "hidden" }}
      >
        <ImageGallery
          photos={item._source.photos}
          height={WEB ? 54 : 110}
          width={width}
        />
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
        allowFontScaling={false}
        style={{
          color: time.color,
          marginTop: 5,
          fontWeight: "700",
          fontSize: WEB ? 11 : 16
        }}
      >
        {time.status}
        <Text
          style={{
            fontSize: WEB ? 10 : 15,
            fontWeight: "700",
            color: "#555"
          }}
        >
          {" "}
          {time.ending ? time.end : time.start}
          {time.upcoming || time.ending ? null : ` ${time.day}`}
        </Text>
        <Text
          style={{
            fontSize: WEB ? 8 : 12,
            fontWeight: "700",
            color: "#999"
          }}
        >
          {" "}
          {time.ending ? time.start : time.end}
        </Text>
      </Text>
      <Text
        numberOfLines={WEB ? 1 : null}
        allowFontScaling={false}
        style={{
          fontSize: WEB ? 13 : 17,
          fontWeight: "700",
          color: "#000"
        }}
      >
        {item._source.location}
        {distance ? (
          <Text
            style={{
              fontSize: WEB ? 11 : 15,
              fontWeight: "700",
              color: "#999"
            }}
            allowFontScaling={false}
          >
            {" "}
            {distance}
          </Text>
        ) : null}
        <PriceText
          priceLevel={item._source.priceLevel}
          prefix=" "
          style={{
            fontSize: WEB ? 11 : 15,
            fontWeight: "700"
          }}
        />
      </Text>
      {item._source.neighborhood ? (
        <Text
          numberOfLines={WEB ? 1 : null}
          style={{
            fontSize: WEB ? 10 : 11,
            fontWeight: "700",
            color: "#555"
          }}
        >
          {item._source.neighborhood}
        </Text>
      ) : null}
      <Text
        allowFontScaling={false}
        numberOfLines={6}
        style={{
          fontSize: WEB ? 13 : 20,
          fontWeight: "700",
          color: "#000",
          marginTop: ANDROID ? -1 : null
        }}
      >
        {item._source.title}{" "}
        <MatchableText
          allowFontScaling={false}
          style={{
            fontSize: WEB ? 13 : 20,
            color: "#000",
            fontWeight: "400"
          }}
          text={item._source.description}
          match={searchTerm}
        />
        {WEB || !item._source.website ? null : (
          <React.Fragment>
            {" "}
            <Text
              onPress={() => {
                dispatch({
                  type: "browser/set",
                  payload: {
                    url: item._source.website,
                    mode: Browser.MODES[0]
                  }
                });
              }}
              style={{
                fontSize: 16,
                color: BLUE,
                fontWeight: "400"
              }}
            >
              {
                item._source.website
                  .replace(/((http|https):\/\/|www.)/gi, "")
                  .split("/")[0]
              }
            </Text>
          </React.Fragment>
        )}
      </Text>

      <Text
        style={{
          fontSize: 11,
          fontWeight: ANDROID ? "700" : "600",
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
