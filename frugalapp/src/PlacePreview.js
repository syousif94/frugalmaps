import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

export default class PlacePreview extends Component {
  render() {
    const { place } = this.props;

    if (!place) {
      return (
        <View style={[styles.container, styles.empty]}>
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
    justifyContent: "center",
    alignItems: "center"
  }
});
