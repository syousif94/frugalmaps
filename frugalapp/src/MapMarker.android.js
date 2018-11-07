import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import { MapView } from "expo";

import ImageGallery from "./ImageGallery";
import { makeHours } from "./Time";

export default class MapMarker extends Component {
  static imageHeight = 90;
  static offset = { x: 0, y: -14 };

  state = {
    height: MapMarker.imageHeight
  };

  _updateHeight = e => {
    const {
      nativeEvent: {
        layout: { height }
      }
    } = e;

    this.setState({
      height: height + MapMarker.imageHeight
    });
  };

  render() {
    const { _source: item } = this.props.data;

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
      <MapView.Marker
        coordinate={coordinate}
        image={require("../assets/pin.png")}
        ref={ref => (this._marker = ref)}
      >
        <View style={styles.marker}>
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>
        {this._renderCallout()}
      </MapView.Marker>
    );
  }

  _renderCallout = () => {
    if (this.props.disabled) {
      return null;
    }

    const { _source: item } = this.props.data;

    const calloutStyle = {
      width: 250,
      height: this.state.height
    };

    const ISO_DAYS = [1, 2, 3, 4, 5, 6, 0];
    const iso = ISO_DAYS[item.days[0]];

    const hours = makeHours(item, iso);

    return (
      <MapView.Callout>
        <View style={calloutStyle}>
          <ImageGallery
            doc={this.props.data}
            height={MapMarker.imageHeight}
            width={250}
          />
          <View style={styles.info} onLayout={this._updateHeight}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.infoText}>{hours}</Text>
            <Text style={styles.infoText}>{item.description}</Text>
          </View>
        </View>
      </MapView.Callout>
    );
  };
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
  info: {
    paddingTop: 4
  },
  titleText: {
    fontWeight: "600",
    color: "#000"
  },
  locationText: {
    fontSize: 12
  },
  infoText: {
    fontSize: 12,
    color: "#444"
  }
});
