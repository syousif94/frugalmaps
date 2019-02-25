import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { withNavigation } from "react-navigation";
import { HEIGHT } from "./Constants";

class SubmitButton extends Component {
  _onPress = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("Submit");
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Entypo size={24} name="plus" color="#fff" />
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(SubmitButton);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: HEIGHT * 0.4 + 35,
    height: 50,
    borderRadius: 25,
    right: 20,
    backgroundColor: "#2FE56E",
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
  btnText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600"
  }
});
