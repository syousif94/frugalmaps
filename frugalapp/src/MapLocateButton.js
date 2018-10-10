import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { BLUE } from "./Colors";

export default class LocateMe extends Component {
  render() {
    return (
      <View style={styles.locate}>
        <TouchableOpacity style={styles.btn}>
          <FontAwesome name="location-arrow" size={18} color={BLUE} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  locate: {
    position: "absolute",
    bottom: 12,
    right: 12,
    height: 44,
    width: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff"
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
