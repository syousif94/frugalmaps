import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class CalendarListHeader extends Component {
  render() {
    const { item, index, section } = this.props;
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
    backgroundColor: "#D80056"
  },
  images: {
    height: 200,
    backgroundColor: "#f2f2f2"
  },
  info: {
    padding: 10
  },
  locationInfo: {
    flexDirection: "row"
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  }
});
