import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";

import emitter from "tiny-emitter/instance";
import { makeISO, timeRemaining, makeYesterdayISO } from "./Time";
import { INITIAL_REGION, ANDROID } from "./Constants";

import * as Location from "./store/location";
import * as Events from "./store/events";
import MapMarker from "./MapMarker";
import locate from "./Locate";
import CalendarItem from "./CalendarItem";

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
    now: Date.now()
  };

  componentDidMount() {
    emitter.on("fit-bounds", this._fitBounds);
    // emitter.on("fit-marker", this._fitMarker);
    // emitter.on("reset-marker", this._resetMarker);
  }

  componentWillUnmount() {
    emitter.off("fit-bounds", this._fitBounds);
    // emitter.off("fit-marker", this._fitMarker);
    // emitter.off("reset-marker", this._resetMarker);
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

  _lastBounds;

  _fitBounds = (bounds, animated = true) => {
    if (!bounds) {
      return;
    }
    this._lastBounds = bounds;

    const bottom = CalendarItem.height;

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
          top: 0,
          right: 0,
          bottom,
          left: 0
        }
      });
    });
  };

  _resetMarker = () => {
    this._fitBounds(this._lastBounds);
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

    const bottom = CalendarItem.height;

    requestAnimationFrame(() => {
      this._map.fitToCoordinates(coords, {
        animated: true,
        edgePadding: {
          top: 0,
          right: 0,
          bottom,
          left: 0
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

  _initialRegion = false;

  _setFrame = () => {
    if (ANDROID || this._initialRegion) {
      return;
    }
    this._initialRegion = true;

    const coords = [
      {
        latitude: 49.699615,
        longitude: -132.530455
      },
      {
        latitude: 16.09332,
        longitude: -59.823265
      }
    ];

    this._map.fitToCoordinates(coords, {
      animated: false,
      edgePadding: {
        top: 0,
        right: 0,
        bottom: CalendarItem.height,
        left: 0
      }
    });
  };

  render() {
    const { markers, authorized } = this.props;

    return (
      <View style={styles.container}>
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
          paddingAdjustmentBehavior="always"
        >
          {markers.map(data => {
            const { _id, _source: item } = data;

            const iso = makeISO(item.days);

            const hours = item.groupedHours.find(group =>
              group.days.find(day => day.iso === iso)
            );

            let { ending, ended } = timeRemaining(hours, iso);

            if (!ending && item.groupedHours.length > 1) {
              const yesterdayISO = makeYesterdayISO(item.days);
              const hours = item.groupedHours.find(group =>
                group.days.find(day => day.iso === yesterdayISO)
              );
              if (hours) {
                const { ending: endingYesterday } = timeRemaining(
                  hours,
                  yesterdayISO
                );
                ending = endingYesterday;
              }
            }

            const upcoming = hours.today && !ended && !ending;

            return (
              <MapMarker
                upcoming={upcoming}
                ending={ending}
                data={data}
                key={`${_id}${this.state.expanded}`}
                expanded={this.state.expanded}
              />
            );
          })}
        </MapView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarMap);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});
