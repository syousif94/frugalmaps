import React, { useRef, useContext, memo } from "react";
import EventSearchInput from "./EventSearchInput";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { ANDROID } from "../utils/Constants";
import { useEveryMinute } from "../utils/Hooks";
import moment from "moment";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import { InputContext } from "./InputContext";
import TagList from "./TagList";

export default memo(() => {
  const inputRef = useRef(null);
  const [searchFocused, setSearchFocused] = useContext(InputContext);
  return (
    <View>
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 10
        }}
      >
        <EventSearchInput
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden"
          }}
          ref={inputRef}
          onFocus={() => {
            setSearchFocused(true);
          }}
          onBlur={() => {
            setSearchFocused(false);
          }}
        />
      </View>
      <TagList
        style={{
          marginTop: 5
        }}
      />
    </View>
  );
});

const ListHeaderFilterButton = ({ searchFocused, inputRef }) => {
  const [currentTime] = useEveryMinute();
  const refreshing = useSelector(state => state.events.refreshing);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  const day = useSelector(state => state.events.day);
  const locationText = useSelector(state => {
    const city = state.events.city;
    const locationEnabled = state.permissions.location;
    const locationText =
      city && city.text.length
        ? city.text.split(",")[0]
        : locationEnabled
        ? "Locating"
        : "Everywhere";
    return locationText;
  });
  const count = useSelector(state => state.events.upNext.length);

  let dayText = "";
  if (day) {
    dayText = day.title;
  } else {
    const today = moment(now);
    dayText = today.format("h:mma dddd M/D");
  }

  let fromNow = "";
  if (refreshing) {
    fromNow = `Refreshing`;
  } else if (!notNow) {
    const minDiff = Math.round((currentTime - now) / 60000);
    if (minDiff >= 60) {
      fromNow = `Refreshed ${parseInt(minDiff / 60, 10)}h ${minDiff % 60}m ago`;
    } else if (minDiff >= 1) {
      fromNow = `Refreshed ${minDiff}m ago`;
    } else {
      fromNow = `Refreshed Just Now`;
    }
  } else if (day) {
    fromNow = day.away ? `${day.away}d away` : "Today";
  } else {
    const minDiff = Math.round(Math.abs(now - currentTime) / 60000);
    if (minDiff >= 60) {
      const totalHours = parseInt(minDiff / 60, 10);
      const days = Math.floor(totalHours / 24);
      if (days) {
        fromNow += `${days}d `;
      }
      const hours = totalHours % 24;
      fromNow += `${hours}h ${minDiff % 60}m away`;
    } else if (minDiff >= 0) {
      fromNow = `${minDiff}m away`;
    }
  }

  let countText = "";
  if (!refreshing && count > 0) {
    countText = ` · ${count} event${count !== 1 ? "s" : ""}`;
  }

  const onPress = () => {
    inputRef.current.focus();
    // requestAnimationFrame(() => {
    //   emitter.emit("filters", PAGE.WHEN);
    // });
  };
  return (
    <TouchableOpacity onPress={onPress} disabled={searchFocused}>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 13,
          color: "#999",
          fontWeight: "500",
          textTransform: "uppercase"
        }}
      >
        {fromNow}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 20,
          color: "#777",
          fontWeight: ANDROID ? "700" : "800",
          textTransform: "uppercase",
          marginTop: 6
        }}
      >
        {locationText}
        {countText}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 30,
          color: "#000",
          fontWeight: ANDROID ? "700" : "800",
          marginBottom: 15
        }}
      >
        {dayText}
      </Text>
    </TouchableOpacity>
  );
};
