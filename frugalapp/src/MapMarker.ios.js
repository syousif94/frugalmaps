import React, { Component } from "react";
import { StyleSheet, Image, View, Text, ScrollView } from "react-native";

import { MapView } from "expo";

import ImageGallery from "./ImageGallery";
import EventList from "./InfoEventList";

export default class MapMarker extends Component {
  static imageHeight = 150;
  static offset = { x: 0, y: -14 };

  shouldComponentUpdate(next) {
    return next.data._id !== this.props.data._id;
  }

  render() {
    const { _source: item, _id } = this.props.data;

    const coordinate = {
      latitude: item.coordinates[1],
      longitude: item.coordinates[0]
    };

    const location = item.location
      .replace(/^(the |a )/gi, "")
      .replace(" ", "")
      .toUpperCase();

    const spot = `${location.slice(0, 2)}\n${location.slice(2, 4)}`;

    return (
      <MapView.Marker coordinate={coordinate} centerOffset={MapMarker.offset}>
        <View style={styles.marker}>
          <Image source={require("../assets/pin.png")} style={styles.marker} />
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>
        <Callout key={_id} {...this.props} />
      </MapView.Marker>
    );
  }
}

class Callout extends Component {
  render() {
    const { disabled, data } = this.props;

    if (disabled) {
      return null;
    }

    const calloutStyle = {
      width: 250,
      height: 230
    };

    return (
      <MapView.Callout>
        <View style={calloutStyle}>
          <ScrollView
            style={{ flex: 1, margin: -15 }}
            contentContainerStyle={{ padding: 15 }}
            scrollIndicatorInsets={{ top: 6, left: 0, right: 5, bottom: 6 }}
          >
            <ImageGallery doc={data} height={130} narrow />
            <Text style={styles.locationText}>{data._source.location}</Text>
            <EventList placeid={data._source.placeid} />
          </ScrollView>
        </View>
      </MapView.Callout>
    );
  }
}

const styles = StyleSheet.create({
  marker: {
    width: 20,
    height: 28
  },
  spot: {
    position: "absolute",
    top: 4,
    left: 0,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  spotText: {
    paddingLeft: 1.5,
    lineHeight: 6,
    textAlign: "center",
    color: "#fff",
    fontSize: 6,
    fontWeight: "700"
  },
  locationText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  }
});
