import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(SubmitButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(26, 173, 77, 0.9)",
    margin: 3.5,
    height: 30,
    width: 50,
    borderRadius: 15
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
