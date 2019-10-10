import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { RED } from "../utils/Colors";
import * as Events from "../store/events";
import { WEB } from "../utils/Constants";

const TouchableOpacity = WEB
  ? require("react-native").TouchableOpacity
  : require("react-native-gesture-handler/touchables/TouchableOpacity").default;

export default ({ item, index }) => {
  const dispatch = useDispatch();
  const onPress = useCallback(() => {
    dispatch(Events.getCity(item));
  }, [item]);
  const [city, state] = item._source.name.split(",");
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titleText}>
          {index + 1}. {city}
        </Text>
        <Text style={styles.subtitleText}>{state.trim()}</Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.count}>
          <Text style={styles.countText}>{item._source.count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    flexDirection: "row"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600"
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 1,
    color: "#777"
  },
  count: {
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: RED
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  }
});
