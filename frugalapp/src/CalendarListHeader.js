import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import { RED } from "./Colors";

export default class CalendarListHeader extends Component {
  static height = 36;
  render() {
    const { section } = this.props;

    let relativeText;

    switch (section.away) {
      case 0:
        relativeText = "Today";
        break;
      case 1:
        relativeText = "Tomorrrow";
        break;
      default:
        relativeText = `${section.away} days away`;
    }

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{relativeText}</Text>
          <View style={styles.relative}>
            <Text style={styles.relativeText}>{section.title}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    backgroundColor: RED,
    height: CalendarListHeader.height
  },
  info: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  },
  relative: {
    marginLeft: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  relativeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  }
});
