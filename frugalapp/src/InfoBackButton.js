import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { withNavigation } from "react-navigation";
import { BLUE } from "./Colors";

class BackButton extends Component {
  _back = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._back} style={styles.backBtn}>
          <Entypo
            style={styles.icon}
            name="chevron-left"
            size={18}
            color={BLUE}
          />
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    top: 8,
    left: 8,
    height: 32,
    borderRadius: 5
  },
  backBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    marginTop: 1.5,
    marginLeft: 6
  },
  text: {
    marginLeft: 4,
    marginRight: 12,
    color: BLUE,
    fontSize: 12,
    fontWeight: "600"
  }
});

export default withNavigation(BackButton);
