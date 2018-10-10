import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MapView } from "expo";
import LocationBox from "./LocationBox";
import LocationList from "./LocationList";
import { FontAwesome } from "@expo/vector-icons";
import { BLUE } from "./Colors";
import emitter from "tiny-emitter/instance";

class LocateMe extends Component {
  render() {
    return (
      <View style={styles.locate}>
        <TouchableOpacity style={styles.btn}>
          <FontAwesome name="location-arrow" size={18} color={BLUE} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default class MapScreen extends Component {
  _search = true;

  componentDidMount() {
    emitter.on("fit-bounds", this._fitBounds);
  }

  componentWillUnmount() {
    emitter.off("fit-bounds", this._fitBounds);
  }

  _fitBounds = bounds => {
    this._search = false;
    const coords = [
      {
        latitude: bounds.northeast.lat,
        longitude: bounds.northeast.lng
      },
      {
        latitude: bounds.southwest.lat,
        longitude: bounds.southwest.lng
      }
    ];
    this._map.fitToCoordinates(coords);
  };

  _onRegionChangeComplete = () => {
    console.log("region changed");

    if (this._search) {
      console.log("should set bounds and search");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <LocationBox />
        <MapView
          ref={ref => (this._map = ref)}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onRegionChangeComplete={this._onRegionChangeComplete}
        />
        <LocateMe />
        <LocationList />
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
  },
  locate: {
    position: "absolute",
    bottom: 12,
    right: 12,
    height: 44,
    width: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff"
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
