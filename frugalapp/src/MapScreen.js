import React, { Component } from "react";
import { StyleSheet, View, PanResponder } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";

import emitter from "tiny-emitter/instance";
import _ from "lodash";

import { INITIAL_REGION } from "./Constants";

import * as Location from "./store/location";
import * as Events from "./store/events";
import LocationBox from "./LocationBox";
import LocationList from "./LocationList";
import LocateMe from "./MapLocateButton";
import DayPicker from "./MapDayPicker";
import MapMarker from "./MapMarker";
import MapLoading from "./MapLoading";

class MapScreen extends Component {
  _search = false;

  _frame;

  constructor(props) {
    super(props);

    this._onRegionChangeComplete = _.debounce(
      this._onRegionChangeComplete,
      100
    );

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if (!this._search) {
          this._search = true;
        }
        if (this._dayPicker) {
          this._dayPicker.getWrappedInstance().close();
        }
        return false;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onShouldBlockNativeResponder: (evt, gestureState) => false
    });
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
    this._map.fitToCoordinates(coords);
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

      emitter.emit("calendar-top");

      this.props.setLocation({
        bounds
      });
      this.props.setEvents({
        refreshing: true,
        bounds
      });
    }
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
    const { markers } = this.props;

    return (
      <View style={styles.container}>
        <LocationBox />
        <View style={styles.map} {...this._panResponder.panHandlers}>
          <MapView
            onLayout={this._setFrame}
            ref={ref => (this._map = ref)}
            style={styles.map}
            initialRegion={INITIAL_REGION}
            onRegionChangeComplete={this._onRegionChangeComplete}
            showsCompass={false}
            rotateEnabled={false}
          >
            {markers.map(data => {
              const { _id } = data;

              return <MapMarker data={data} key={_id} />;
            })}
          </MapView>
          <MapLoading />
        </View>
        <DayPicker ref={ref => (this._dayPicker = ref)} />
        <LocateMe />
        <LocationList />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  markers: Events.markers(state)
});

const mapDispatchToProps = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  map: {
    flex: 1
  }
});
