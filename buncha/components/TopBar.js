import React from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import BlurView from "./BlurView";
import EventSearchInput from "./EventSearchInput";

const topInset = getInset("top");
export const topBarHeight = 68 + topInset;

export default ({ style = { paddingLeft: 15 }, containerStyle = {} }) => {
  const city = useSelector(state => state.events.city);
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

  return (
    <BlurView style={[styles.container, containerStyle]}>
      <View style={[styles.content, style]}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text allowFontScaling={false} style={styles.titleText}>
            {day}
            <Text style={{ color: "#777", fontWeight: "500" }}>
              {" "}
              refreshed{" "}
            </Text>
            0m ago
          </Text>
          <Text allowFontScaling={false} style={styles.titleText}>
            {locationText}
          </Text>
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
    paddingTop: IOS ? topInset : 10,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)"
  },
  titleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000"
  },
  timeText: {
    fontSize: 24,
    fontWeight: "700"
  },
  locationText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "700"
  },
  count: {
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginLeft: 7
  },
  countText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff"
  },
  search: {
    height: 36,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "rgba(180,180,180,0.1)"
  },
  searchText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "400",
    color: "#777"
  }
});
