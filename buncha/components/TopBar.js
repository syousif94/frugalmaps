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
// export const topBarHeight = IOS ? 52 + topInset : 72;

export const topBarHeight = topInset;

export default ({ style = { paddingLeft: 15 }, containerStyle = {} }) => {
  // const [currentTime] = useEveryMinute();
  // const notNow = useSelector(state => state.events.notNow);
  // const now = useSelector(state => state.events.now);
  // const day = useSelector(state => state.events.day);
  // const locationText = useSelector(state => {
  //   const city = state.events.city;
  //   const locationEnabled = state.permissions.location;
  //   const locationText =
  //     city && city.text.length
  //       ? city.text.split(",")[0]
  //       : locationEnabled
  //       ? "Locating"
  //       : "Everywhere";
  //   return locationText;
  // });
  // const count = useSelector(state => state.events.upNext.length);

  // let dayText = "";
  // if (!notNow) {
  //   const today = moment(now);
  //   dayText = today.format("h:mma");
  // }

  // let fromNow = "";
  // if (!notNow) {
  //   const minDiff = Math.ceil((currentTime - now) / 60000);
  //   if (minDiff >= 60) {
  //     fromNow = ` ${parseInt(minDiff / 60, 10)}h ${minDiff % 60}m ago`;
  //   } else if (minDiff >= 0) {
  //     fromNow = ` ${minDiff}m ago`;
  //   }
  // } else if (day) {
  //   fromNow = day.title;
  // } else {
  //   const today = moment(now);
  //   fromNow = today.format("dddd h:mma");
  // }

  return null;

  return (
    <BlurView style={[styles.container, containerStyle]}>
      <View style={[styles.content, style]}>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Text allowFontScaling={false} style={styles.titleText}>
            {dayText}
            <Text style={{ color: "#000" }}>{fromNow}</Text> {locationText}
          </Text>
          {count ? (
            <Text allowFontScaling={false} style={styles.countText}>
              {" "}
              {count} events
            </Text>
          ) : null}
        </View> */}
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
    justifyContent: "space-between",
    paddingTop: IOS ? topInset : 4,
    paddingBottom: 6,
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
