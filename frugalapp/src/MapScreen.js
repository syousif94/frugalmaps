import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";
import _ from "lodash";

import * as Location from "./store/location";
import * as Events from "./store/events";
import LocationBox from "./LocationBox";
import LocationList from "./LocationList";
import { BLUE } from "./Colors";

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

class MapScreen extends Component {
  _search = false;

  _frame;

  constructor(props) {
    super(props);

    this._onRegionChangeComplete = _.debounce(
      this._onRegionChangeComplete,
      100
    );
  }

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
    this._map.fitToCoordinates(coords, { animated: false });
  };

  _onRegionChangeComplete = async () => {
    if (this._search && this._frame) {
      const { x, y, height, width } = this._frame;

      const northeast = ({
        latitude: lat,
        longitude: lng
      } = await this._map.coordinateForPoint({ y, x: x + width }));

      const southwest = ({
        latitude: lat,
        longitude: lng
      } = await this._map.coordinateForPoint({ y: y + height, x }));

      const bounds = {
        northeast,
        southwest
      };

      this.props.setLocation({
        bounds
      });
      this.props.setEvents({
        refreshing: true,
        bounds
      });
    }

    this._search = true;
  };

  _setFrame = e => {
    const {
      nativeEvent: {
        layout: { x, y, height, width }
      }
    } = e;

    this._frame = {
      x,
      y,
      height,
      width
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <LocationBox />
        <MapView
          onLayout={this._setFrame}
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

const mapDispatchToProps = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

export default connect(
  null,
  mapDispatchToProps
)(MapScreen);

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
