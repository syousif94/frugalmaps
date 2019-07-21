import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { navigate } from "../screens";
import { RED } from "../utils/Colors";
import * as Events from "../store/events";
import { WEB } from "../utils/Constants";

export default ({ item, index, toggle }) => {
  const dispatch = useDispatch();
  const onPress = useCallback(() => {
    if (WEB) {
      dispatch(Events.getCity(item));
      navigate("UpNext");
    } else {
      toggle();
      setTimeout(() => {
        dispatch(Events.getCity(item));
      }, 350);
    }
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
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
    color: "#aaa"
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
