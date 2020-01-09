import React, { useRef, useState, useContext } from "react";
import EventSearchInput from "./EventSearchInput";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { ANDROID } from "../utils/Constants";
import { useEveryMinute } from "../utils/Hooks";
import moment from "moment";
import emitter from "tiny-emitter/instance";
import { PAGE } from "../store/filters";
import { itemMargin } from "./UpNextItem";
import { BLUE } from "../utils/Colors";
import { Entypo } from "@expo/vector-icons";
import _ from "lodash";
import { InputContext } from "./InputContext";

export default () => {
  const inputRef = useRef(null);
  const [searchFocused, setSearchFocused] = useContext(InputContext);
  return (
    <View
      style={{
        marginTop: ANDROID ? 7 : 10,
        paddingHorizontal: itemMargin / 2
      }}
    >
      <ListHeaderFilterButton searchFocused={searchFocused} />
      <EventSearchInput
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center"
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
  );
};

const ListHeaderFilterButton = ({ searchFocused }) => {
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
    dayText = today.format("dddd h:mma");
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
    requestAnimationFrame(() => {
      emitter.emit("filters", PAGE.WHEN);
    });
  };
  return (
    <TouchableOpacity onPress={onPress} disabled={searchFocused}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 30,
              color: "#000",
              fontWeight: ANDROID ? "700" : "800"
            }}
          >
            {dayText}
          </Text>
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
        </View>
        <View
          style={{
            alignItems: "center",
            marginRight: 7,
            paddingTop: 5
          }}
        >
          <Entypo
            name="chevron-up"
            color={BLUE}
            size={17}
            style={{ marginBottom: -8 }}
          />
          <Entypo name="chevron-down" color={BLUE} size={17} />
        </View>
      </View>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 20,
          color: "#777",
          fontWeight: ANDROID ? "700" : "800",
          textTransform: "uppercase",
          marginTop: 6,
          paddingBottom: 15
        }}
      >
        {locationText}
        {countText}
      </Text>
    </TouchableOpacity>
  );
};
