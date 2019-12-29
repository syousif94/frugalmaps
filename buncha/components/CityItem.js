import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { BLUE } from "../utils/Colors";
import * as Events from "../store/events";
import { WEB } from "../utils/Constants";
import { roundedDistanceTo } from "../utils/Locate";

const TouchableOpacity = WEB
  ? require("react-native").TouchableOpacity
  : require("react-native-gesture-handler/touchables/TouchableOpacity").default;

export default ({ item, index }) => {
  const dispatch = useDispatch();
  const onPress = useCallback(() => {
    dispatch(Events.getCity(item));
  }, [item]);
  const [city, state] = item._source.name.split(",");
  const subtext = state.trim();
  const distance = roundedDistanceTo(item);
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View>
        <Text style={styles.titleText}>
          {city}
          <Text style={styles.countText}> {item._source.count}</Text>
        </Text>
        <Text style={styles.subtitleText}>
          {subtext}
          {distance ? (
            <Text style={styles.distanceText}> {distance}</Text>
          ) : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 4,
    marginTop: 6,
    marginHorizontal: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.04)"
  },
  titleText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.7)",
    fontWeight: "600"
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
    color: "#777"
  },
  distanceText: {
    fontWeight: "600",
    color: "#666"
  },
  count: {
    justifyContent: "center"
  },
  countText: {
    fontWeight: "700",
    color: BLUE
  }
});
