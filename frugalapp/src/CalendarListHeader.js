import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import { RED } from "./Colors";

export default class CalendarListHeader extends Component {
  static height = 36;
  render() {
    const { section } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{section.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: RED,
    height: CalendarListHeader.height
  },
  info: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center"
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  }
});
