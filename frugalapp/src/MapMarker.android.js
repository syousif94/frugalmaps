import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import { MapView } from "expo";
import emitter from "tiny-emitter/instance";

const redPin = require("../assets/pin.png");
const greenPin = require("../assets/pin-now.png");
const orangePin = require("../assets/pin-upcoming.png");

export default class MapMarker extends PureComponent {
  static imageHeight = 60;
  static offset = { x: 0, y: -14 };

  componentDidMount() {
    emitter.on("fit-marker", this._fitMarker);
    emitter.on("hide-callouts", this._hideCallout);
  }

  componentWillUnmount() {
    emitter.off("fit-marker", this._fitMarker);
    emitter.off("hide-callouts", this._hideCallout);
  }

  _visibleCallout = false;

  _hideCallout = () => {
    if (this._visibleCallout) {
      this._visibleCallout = false;
      this._marker.hideCallout();
    }
  };

  _fitMarker = doc => {
    const {
      _source: { placeid }
    } = doc;

    if (placeid === this.props.data._source.placeid) {
      this._visibleCallout = true;
      this._marker.showCallout();
    }
  };
  _setRef = ref => {
    this._marker = ref;
  };

  render() {
    const {
      data: { _source: item },
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

    const pinSource = ending ? greenPin : upcoming ? orangePin : redPin;

    const streetText = item.address
      .split(",")
      .find(val => val.length > 5)
      .trim();
    const markerProps = {
      title: item.location,
      description: streetText
    };

    return (
      <MapView.Marker
        coordinate={coordinate}
        image={pinSource}
        ref={this._setRef}
        identifier={item.placeid}
        {...markerProps}
      >
        <View style={styles.marker}>
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>
      </MapView.Marker>
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
  }
});
