import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RED, BLUE } from "./Colors";
import { MapView, Linking } from "expo";
import { INITIAL_REGION } from "./Constants";

export default class PlacePreview extends Component {
  componentDidUpdate(previous) {
    const { place } = this.props;
    if (place && previous.place !== place) {
      const viewport = place.geometry.viewport;
      const coords = [
        {
          latitude: viewport.northeast.lat,
          longitude: viewport.northeast.lng
        },
        {
          latitude: viewport.southwest.lat,
          longitude: viewport.southwest.lng
        }
      ];

      this._map.fitToCoordinates(coords, { animated: false });
    }
  }

  _call = () => {
    const { place } = this.props;

    if (!place || !place.international_phone_number) {
      return;
    }

    const url = `tel:${place.international_phone_number}`;
    Linking.openURL(url).catch(err => console.log(err));
  };

  render() {
    const { place } = this.props;

    if (!place) {
      return (
        <View style={styles.empty}>
          <MapView
            style={styles.map}
            pointerEvents="none"
            initialRegion={INITIAL_REGION}
          />
          <Text style={styles.instruction}>
            Select a restaurant from the previous page first
          </Text>
        </View>
      );
    }

    const coordinate = {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
    };

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this._map = ref)}
          style={styles.map}
          pointerEvents="none"
        >
          <MapView.Circle
            strokeColor="#fff"
            fillColor={RED}
            radius={18}
            strokeWidth={2}
            center={coordinate}
          />
        </MapView>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.formatted_address}</Text>
        <TouchableOpacity onPress={this._call} style={styles.callBtn}>
          <Text style={styles.phone}>{place.international_phone_number}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  map: {
    height: 190,
    borderRadius: 8,
    alignSelf: "stretch"
  },
  empty: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: RED,
    justifyContent: "center",
    alignItems: "center"
  },
  instruction: {
    marginTop: 10,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center"
  },
  name: {
    marginTop: 5,
    fontWeight: "500"
  },
  address: {
    marginTop: 2,
    color: "#555"
  },
  callBtn: {},
  phone: {
    marginTop: 2,
    color: BLUE
  }
});
