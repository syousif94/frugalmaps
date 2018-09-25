import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { RED } from "./Colors";

export default class PlacePreview extends Component {
  render() {
    const { place } = this.props;

    if (!place) {
      return (
        <View style={styles.empty}>
          <Text style={styles.instruction}>
            Select a restaurant from the previous page first
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Image source={{}} style={styles.img} />
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.formatted_address}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 180
  },
  empty: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: RED,
    justifyContent: "center",
    alignItems: "center"
  },
  instruction: {
    fontWeight: "600",
    color: "#fff",
    textAlign: "center"
  }
});
