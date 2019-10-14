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
export const topBarHeight = IOS ? 68 + topInset : 72;

export default ({ style = { paddingLeft: 15 }, containerStyle = {} }) => {
  const [currentTime] = useEveryMinute();
  const now = useSelector(state => state.events.now);
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

  const today = moment(now);
  const day = today.format("ddd h:mma");
  const minDiff = Math.ceil((currentTime - now) / 60000);
  let fromNow = "";

  if (minDiff < 0) {
  } else if (minDiff >= 60) {
    fromNow = ` ${parseInt(minDiff / 60, 10)}h ${minDiff % 60}m ago`;
  } else {
    fromNow = ` ${minDiff}m ago`;
  }

  return (
    <BlurView style={[styles.container, containerStyle]}>
      <View style={[styles.content, style]}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text allowFontScaling={false} style={styles.titleText}>
            {day}
            <Text style={{ color: "#777" }}>{fromNow}</Text>
          </Text>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.titleText}>
              {locationText}
            </Text>
            {count ? (
              <View style={styles.count}>
                <Text allowFontScaling={false} style={styles.countText}>
                  {count}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
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
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  count: {
    justifyContent: "center",
    paddingHorizontal: 2,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginLeft: 4
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff"
  }
});
