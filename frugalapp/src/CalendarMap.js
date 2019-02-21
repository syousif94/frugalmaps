import React, { PureComponent } from "react";
import { StyleSheet, TouchableOpacity, Animated, Text } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";

import emitter from "tiny-emitter/instance";
import { makeISO, timeRemaining } from "./Time";
import { INITIAL_REGION, HEIGHT } from "./Constants";

import * as Location from "./store/location";
import * as Events from "./store/events";
import MapMarker from "./MapMarker";
import locate from "./Locate";
import CityPicker from "./CalendarCityPicker";
import MapLoading from "./MapLoading";

const mapStateToProps = state => ({
  markers: Events.markerList(state),
  authorized: state.location.authorized
});

const mapDispatchToProps = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

class CalendarMap extends PureComponent {
  static mapId = "mapScreen";
  static searchId = "mapScreen";

  state = {
    now: Date.now(),
    expanded: false,
    position: new Animated.Value(0)
  };

  componentDidMount() {
    emitter.on("fit-bounds", this._fitBounds);
    emitter.on("fit-marker", this._fitMarker);
    emitter.on("toggle-map", this._toggleMap);
  }

  componentWillUnmount() {
    emitter.off("fit-bounds", this._fitBounds);
    emitter.off("fit-marker", this._fitMarker);
    emitter.off("toggle-map", this._toggleMap);
  }

  _toggleMap = () => {
    const toValue = this.state.expanded ? 0 : 1;

    Animated.timing(
      this.state.position,
      { toValue, duration: 350 },
      { useNativeDriver: true }
    ).start(() => {
      this._fitBounds(this._lastBounds);
      this.setState({
        expanded: !this.state.expanded
      });
    });
  };

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

  _lastBounds;

  _fitBounds = (bounds, animated = true) => {
    if (!bounds) {
      return;
    }
    this._lastBounds = bounds;
    const padding = this.state.expanded ? 0 : -30;
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
      this._map.fitToCoordinates(coords, {
        animated,
        edgePadding: {
          top: padding,
          right: padding,
          bottom: padding,
          left: padding
        }
      });
    });
  };

  _fitMarker = doc => {
    const {
      _source: { viewport }
    } = doc;

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

    requestAnimationFrame(() => {
      this._map.fitToCoordinates(coords, {
        animated: true,
        edgePadding: {
          top: 80,
          right: 80,
          bottom: 80,
          left: 80
        }
      });
    });
  };

  _setMapRef = ref => {
    this._map = ref;
  };

  _hideCallouts = () => {
    emitter.emit("hide-callouts");
  };

  render() {
    const { markers, authorized } = this.props;

    const containerStyle = [
      {
        height: this.state.position.interpolate({
          inputRange: [0, 1],
          outputRange: [HEIGHT * 0.31, HEIGHT]
        })
      }
    ];

    const toggleStyle = [styles.toggle, { opacity: this.state.position }];

    const togglePointerEvents = this.state.expanded ? "auto" : "none";

    return (
      <Animated.View style={containerStyle}>
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
          onPress={this._hideCallouts}
        >
          {markers.map(data => {
            const { _id, _source: item } = data;

            const iso = makeISO(item.days);
            const { ending } = timeRemaining(item.groupedHours[0], iso);

            return (
              <MapMarker
                ending={ending}
                data={data}
                key={`${_id}${this.state.expanded}`}
                expanded={this.state.expanded}
              />
            );
          })}
        </MapView>
        <CityPicker tabLabel="Closest" position={this.state.position} />
        <MapLoading />
        <Animated.View style={toggleStyle} pointerEvents={togglePointerEvents}>
          <TouchableOpacity onPress={this._toggleMap} style={styles.toggleBtn}>
            <Entypo
              style={styles.icon}
              name="chevron-up"
              size={16}
              color="#fff"
            />
            <Text style={styles.btnText}>Map</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarMap);

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  toggle: {
    position: "absolute",
    bottom: 45,
    left: 25
  },
  toggleBtn: {
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(90,90,90,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 8
  },
  btnText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6
  },
  icon: {
    marginTop: 2
  }
});
