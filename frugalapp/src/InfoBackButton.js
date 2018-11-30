import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { withNavigation } from "react-navigation";
import { BLUE } from "./Colors";

class BackButton extends Component {
  _back = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <TouchableOpacity onPress={this._back} style={styles.backBtn}>
        <Ionicons color={BLUE} name="ios-arrow-back" size={28} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    width: 54,
    alignItems: "center"
  }
});

export default withNavigation(BackButton);
