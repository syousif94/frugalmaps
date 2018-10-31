import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RED, BLUE } from "./Colors";
import { MapView, Linking } from "expo";

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
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.formatted_address}</Text>
        <TouchableOpacity onPress={this._call} style={styles.callBtn}>
          <Text style={styles.phone}>{place.international_phone_number}</Text>
        </TouchableOpacity>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 190,
    margin: 5
  },
  map: {
    marginTop: 5,
    flex: 1,
    borderRadius: 8
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
  },
  name: {
    fontWeight: "500"
  },
  address: {
    marginTop: 2,
    color: "#a9a9a9"
  },
  callBtn: {},
  phone: {
    marginTop: 2,
    color: BLUE
  }
});
