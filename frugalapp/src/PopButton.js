import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { BLUE } from "./Colors";
import { withNavigation } from "react-navigation";
import { ANDROID } from "./Constants";

class PopButton extends Component {
  _onPress = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };
  render() {
    if (ANDROID) {
      return null;
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Entypo size={24} name="chevron-down" color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(PopButton);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    height: 60,
    width: 60,
    borderRadius: 30,
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
    justifyContent: "center",
    alignItems: "center"
  }
});
