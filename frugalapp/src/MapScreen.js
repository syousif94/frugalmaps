import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { MapView } from "expo";

export default class MapScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        {" "}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red"
  },
  map: {
    flex: 1
  }
});
