import React, { Component, PureComponent } from "react";
import { StyleSheet, Image, View, Text, ScrollView } from "react-native";

import { MapView } from "expo";
import { FontAwesome } from "@expo/vector-icons";

import ImageGallery from "./ImageGallery";
import EventList from "./InfoEventList";

const redPin = require("../assets/pin.png");
const greenPin = require("../assets/pin-now.png");

export default class MapMarker extends Component {
  static imageHeight = 150;
  static offset = { x: 0, y: -14 };

  shouldComponentUpdate(next) {
    return (
      next.data._id !== this.props.data._id || next.ending !== this.props.ending
    );
  }

  _onSelect = () => {
    this._callout.toggleTick(true);
  };

  _onDeselect = () => {
    this._callout.toggleTick(false);
  };

  _setCalloutRef = ref => {
    this._callout = ref;
  };

  render() {
    const {
      data: { _source: item, _id },
      ending
    } = this.props;

    const coordinate = {
      latitude: item.coordinates[1],
      longitude: item.coordinates[0]
    };

    const location = item.location
      .replace(/^(the |a )/gi, "")
      .replace(" ", "")
      .toUpperCase();

    const spot = `${location.slice(0, 2)}\n${location.slice(2, 4)}`;

    const pinSource = ending ? greenPin : redPin;

    return (
      <MapView.Marker
        coordinate={coordinate}
        centerOffset={MapMarker.offset}
        onSelect={this._onSelect}
        onDeselect={this._onDeselect}
      >
        <View style={styles.marker}>
          <Image source={pinSource} style={styles.marker} />
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>
        <Callout ref={this._setCalloutRef} key={_id} {...this.props} />
      </MapView.Marker>
    );
  }
}

class Callout extends PureComponent {
  static scrollIndicatorInsets = { top: 6, left: 0, right: 5, bottom: 6 };

  state = {
    tick: false
  };

  toggleTick = tick => {
    this.setState({
      tick
    });
  };

  render() {
    const { disabled, data } = this.props;

    if (disabled) {
      return null;
    }

    const calloutStyle = {
      width: 250,
      height: 230
    };

    let streetText = data._source.address
      .split(",")
      .find(val => val.length > 5)
      .trim();

    const sort = data.events[0].sort;

    if (sort && sort[0]) {
      streetText = `${sort[0].toFixed(1)}mi · ${streetText}`;
    }

    return (
      <MapView.Callout>
        <View style={calloutStyle}>
          <ScrollView
            style={styles.scroller}
            contentContainerStyle={styles.scrollContent}
            scrollIndicatorInsets={Callout.scrollIndicatorInsets}
          >
            <ImageGallery doc={data} height={130} narrow />
            <View style={styles.locationInfo}>
              <View>
                <Text style={styles.locationText}>{data._source.location}</Text>
                <Text style={styles.streetText}>{streetText}</Text>
              </View>
              <View style={styles.rating}>
                <FontAwesome name="star" size={12} color="#FFA033" />
                <Text style={styles.ratingText}>{data._source.rating}</Text>
              </View>
            </View>
            <EventList tick={this.state.tick} placeid={data._source.placeid} />
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
  scroller: {
    flex: 1,
    margin: -15
  },
  scrollContent: {
    padding: 15
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
  locationInfo: {
    marginTop: 5,
    flexDirection: "row"
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  streetText: {
    color: "#444",
    fontSize: 10
  },
  rating: {
    position: "absolute",
    top: 0,
    right: 5,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  ratingText: {
    color: "#FFA033",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 3
  }
});
