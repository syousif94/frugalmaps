import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { withNavigation } from "react-navigation";

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
          <Entypo size={18} name="plus" color="#fff" />
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(SubmitButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(26, 173, 77, 0.9)",
    marginRight: 5,
    height: 30,
    borderRadius: 15
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 11
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 4
  }
});
