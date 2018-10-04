import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MapView } from "expo";
import LocationBox from "./LocationBox";
import LocationUIProvider from "./LocationUI";
import LocationList from "./LocationList";
import { FontAwesome } from "@expo/vector-icons";
import { BLUE } from './Colors'

class LocateMe extends Component {
  render() {
    return (
      <View style={styles.locate}>
        <TouchableOpacity style={styles.btn}>
          <FontAwesome name="location-arrow" size={18} color={BLUE} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default class MapScreen extends Component {
  render() {
    return (
      <LocationUIProvider>
        <View style={styles.container}>
          <LocationBox />
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
          <LocateMe />
          <LocationList />
        </View>
      </LocationUIProvider>
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
  },
  locate: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    height: 44,
    width: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff'
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
