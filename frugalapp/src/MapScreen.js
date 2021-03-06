import React, { PureComponent } from "react";
import { StyleSheet, View, PanResponder } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";

import emitter from "tiny-emitter/instance";
import _ from "lodash";
import { makeISO, timeRemaining } from "./Time";
import CalendarDayPicker from "./CalendarDayPicker";

import { INITIAL_REGION, ANDROID } from "./Constants";

import * as Location from "./store/location";
import * as Events from "./store/events";
import LocationBox from "./LocationBox";
import LocationLists from "./LocationLists";
import MapMarker from "./MapMarker";
import MapLoading from "./MapLoading";
import locate from "./Locate";
import SearchButton from "./SearchButton";

var initialAndroidBounds = null;

if (ANDROID) {
  emitter.on("fit-bounds", bounds => {
    initialAndroidBounds = bounds;
  });
}

class MapScreen extends PureComponent {
  static mapId = "mapScreen";
  static searchId = "mapScreen";

  state = {
    now: Date.now(),
    markers: false
  };

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
        // if (this._dayPicker) {
        //   this._dayPicker.getWrappedInstance().close();
        // }
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
    emitter.on(MapScreen.mapId, this._showLocation);
    emitter.once("enable-markers", this._enableMarkers);
  }

  _enableMarkers = () => {
    this.setState(
      {
        markers: true
      },
      () => {
        this._interval = setInterval(() => {
          this.setState({
            now: Date.now()
          });
        }, 60000);
      }
    );
  };

  componentWillUnmount() {
    emitter.off("fit-bounds", this._fitBounds);
    emitter.off(MapScreen.mapId, this._showLocation);
    // emitter.off("enable-markers", this._enableMarkers);
    clearInterval(this._interval);
  }

  _showLocation = async () => {
    const coords = this.props.markers.map(marker => {
      return {
        latitude: marker._source.coordinates[1],
        longitude: marker._source.coordinates[0]
      };
    });

    const {
      coords: { latitude, longitude }
    } = await locate();

    coords.push({
      latitude,
      longitude
    });

    this._map.fitToCoordinates(coords, {
      edgePadding: {
        top: 25,
        left: 25,
        right: 25,
        bottom: 60
      }
    });
  };

  _fitBounds = (bounds, animated = true) => {
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
    requestAnimationFrame(() => {
      this._map.fitToCoordinates(coords, { animated });
    });
  };

  _onRegionChangeComplete = async () => {
    if (ANDROID) {
      return;
    }
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
        bounds,
        queryType: null
      });
    }
  };

  _setInitialViewport = true;

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

    if (ANDROID && this._setInitialViewport && initialAndroidBounds) {
      this._setInitialViewport = false;

      requestAnimationFrame(() => {
        this._fitBounds(initialAndroidBounds, false);
      });
    }
  };

  _setMapRef = ref => {
    this._map = ref;
  };

  _setDayPickerRef = ref => {
    this._dayPicker = ref;
  };

  render() {
    const { markers, authorized } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <LocationBox id={MapScreen.searchId} />
          <MapLoading />
        </View>
        <View style={styles.map} {...this._panResponder.panHandlers}>
          <MapView
            onLayout={this._setFrame}
            ref={this._setMapRef}
            style={styles.map}
            initialRegion={INITIAL_REGION}
            onRegionChangeComplete={this._onRegionChangeComplete}
            showsCompass={false}
            rotateEnabled={false}
            toolbarEnabled={false}
            showsUserLocation={authorized}
            showsMyLocationButton={false}
            pitchEnabled={false}
          >
            {this.state.markers
              ? markers.map(data => {
                  const { _id, _source: item } = data;

                  const iso = makeISO(item.days);

                  const { ending } = timeRemaining(item.groupedHours[0], iso);

                  return <MapMarker ending={ending} data={data} key={_id} />;
                })
              : null}
          </MapView>
        </View>
        <CalendarDayPicker />
        <SearchButton id={MapScreen.searchId} />
        <LocationLists id={MapScreen.searchId} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  markers: Events.markerList(state),
  authorized: state.location.authorized
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
