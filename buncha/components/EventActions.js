import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { RED } from "../utils/Colors";
import * as Interested from "../store/interested";
import { useDispatch } from "react-redux";

export default ({ item }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5
      }}
    >
      <InterestedButton item={item} />
      <LikeButton item={item} />
    </View>
  );
};

const LikeButton = ({ item }) => {
  return (
    <View style={styles.buttonView}>
      <TouchableOpacity style={styles.button}>
        <Ionicons
          allowFontScaling={false}
          name="ios-heart"
          size={13}
          color="#bbb"
        />
        <Text allowFontScaling={false} style={styles.buttonText}>
          14
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const InterestedButton = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <View style={[styles.buttonView, { marginRight: 5 }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dispatch(Interested.show({ event: item }));
        }}
      >
        <FontAwesome
          allowFontScaling={false}
          name="star"
          size={13}
          color="#bbb"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    backgroundColor: "#fafafa",
    borderRadius: 3
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    height: 26,
    paddingHorizontal: 7
  },
  buttonText: {
    marginTop: -1,
    marginLeft: 6,
    fontSize: 10,
    fontWeight: "700",
    color: "#555"
  }
});
