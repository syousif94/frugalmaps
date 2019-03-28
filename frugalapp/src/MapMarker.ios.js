import React, { Component } from "react";
import { StyleSheet, Image, View, Text } from "react-native";

import { MapView } from "expo";
import emitter from "tiny-emitter/instance";

// const redPin = require("../assets/pin.png");
// const greenPin = require("../assets/pin-now.png");
// const orangePin = require("../assets/pin-upcoming.png");
const redSelectedPin = require("../assets/pin-selected.png");
const greenSelectedPin = require("../assets/pin-now-selected.png");
const orangeSelectedPin = require("../assets/pin-upcoming-selected.png");

export default class MapMarker extends Component {
  static imageHeight = 150;
  static offset = { x: 0, y: -14 };

  state = {
    selected: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.selected !== nextState.selected ||
      nextProps.data._id !== this.props.data._id ||
      nextProps.ending !== this.props.ending
    );
  }

  componentDidMount() {
    emitter.on("fit-marker", this._fitMarker);
    emitter.on("hide-callouts", this._hideCallout);
  }

  componentWillUnmount() {
    emitter.off("fit-marker", this._fitMarker);
    emitter.off("hide-callouts", this._hideCallout);
  }

  _hideCallout = () => {
    if (this.state.selected) {
      this._marker.hideCallout();
    }
  };

  _fitMarker = doc => {
    const {
      _source: { placeid }
    } = doc;

    const selected = placeid === this.props.data._source.placeid;

    if (selected !== this.state.selected) {
      if (selected) {
        this._marker.showCallout();
      } else {
        this._marker.hideCallout();
      }
    }
  };

  _onSelect = () => {
    this.setState({
      selected: true
    });
    // this._callout.getWrappedInstance().toggleTick(true);
  };

  _onDeselect = () => {
    this.setState({
      selected: false
    });
    // this._callout.getWrappedInstance().toggleTick(false);
  };

  _setCalloutRef = ref => {
    this._callout = ref;
  };

  _setRef = ref => {
    this._marker = ref;
  };

  render() {
    const {
      data: { _source: item, _id },
      ending,
      upcoming
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

    const markerStyle = [styles.marker];
    const imageStyle = [styles.image];
    const spotStyle = [styles.spot];
    const spotTextStyle = [styles.spotText];
    let offset = MapMarker.offset;
    const pinSource = ending
      ? greenSelectedPin
      : upcoming
      ? orangeSelectedPin
      : redSelectedPin;

    if (this.state.selected) {
      markerStyle.push(styles.selectedMarker);
      offset = { x: 0, y: -28 };
    }

    return (
      <MapView.Marker
        coordinate={coordinate}
        centerOffset={offset}
        ref={this._setRef}
        onSelect={this._onSelect}
        onDeselect={this._onDeselect}
        identifier={item.placeid}
      >
        <View style={markerStyle}>
          <Image source={pinSource} style={imageStyle} />
          <View style={spotStyle}>
            <Text style={spotTextStyle}>{spot}</Text>
          </View>
        </View>
      </MapView.Marker>
    );
  }
}

const styles = StyleSheet.create({
  marker: {
    width: 40,
    height: 56,
    transform: [{ scale: 0.5 }]
  },
  selectedMarker: {
    zIndex: 2,
    transform: [{ scale: 1 }]
  },
  image: {
    width: 40,
    height: 56
  },
  spot: {
    position: "absolute",
    top: 8,
    width: 36,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  spotText: {
    paddingLeft: 3,
    lineHeight: 12,
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
    fontWeight: "700"
  }
});
