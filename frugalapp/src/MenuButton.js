import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { BLUE } from "./Colors";
import emitter from "tiny-emitter/instance";

class MenuButton extends Component {
  _onPress = () => {
    requestAnimationFrame(() => {
      emitter.emit("toggle-menu", true);
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Entypo size={24} name="menu" color="#fff" />
          <Text style={styles.text}>Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MenuButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    height: 50,
    borderRadius: 25,
    right: 20,
    backgroundColor: BLUE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15
  },
  text: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
    color: "#fff"
  }
});
