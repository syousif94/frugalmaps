import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import emitter from "tiny-emitter/instance";

class SearchButton extends Component {
  _onPress = () => {
    requestAnimationFrame(() => {
      emitter.emit("toggle-search", true);
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Entypo size={16} name="magnifying-glass" color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default SearchButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(21, 122, 252, 0.9)",
    margin: 3.5,
    height: 30,
    width: 50,
    borderRadius: 15
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
