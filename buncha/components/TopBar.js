import React from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import BlurView from "./BlurView";
import EventSearchInput from "./EventSearchInput";
import { useEveryMinute } from "../utils/Hooks";

const topInset = getInset("top");
export const topBarHeight = IOS ? 100 + topInset : 110;

export default ({ style = { paddingLeft: 15 }, containerStyle = {} }) => {
  const [currentTime] = useEveryMinute();
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
  if (!notNow) {
    const minDiff = Math.round((currentTime - now) / 60000);
    if (minDiff >= 60) {
      fromNow = ` · ${parseInt(minDiff / 60, 10)}h ${minDiff % 60}m ago`;
    } else if (minDiff >= 1) {
      fromNow = ` · ${minDiff}m ago`;
    } else if (minDiff >= 0) {
      fromNow = " · Now";
    }
  } else if (day) {
    fromNow = ` · ${day.away}d away`;
  }

  let countText = "";
  if (count > 0) {
    countText = ` · ${count} event${count !== 1 ? "s" : ""}`;
  }

  return (
    <BlurView style={[styles.container, containerStyle]}>
      <View style={[styles.content, style]}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            color: "#444",
            fontWeight: "700",
            textTransform: "uppercase"
          }}
        >
          {locationText}
          {fromNow}
          {countText}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 22,
            color: "#000",
            fontWeight: "700",
            marginBottom: 5
          }}
        >
          {dayText}
        </Text>
        <EventSearchInput
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center"
          }}
        />
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: topBarHeight
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  content: {
    flex: 1,
    paddingTop: IOS ? topInset : 4,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)"
  },
  titleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777"
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000"
  }
});
