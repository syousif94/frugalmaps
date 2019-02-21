import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";

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
    now: Date.now()
  };

  componentDidMount() {
    emitter.on("fit-bounds", this._fitBounds);
    emitter.on("fit-marker", this._fitMarker);
  }

  componentWillUnmount() {
    emitter.off("fit-bounds", this._fitBounds);
    emitter.off("fit-marker", this._fitMarker);
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
      this._map.fitToCoordinates(coords, {
        animated,
        edgePadding: {
          top: -30,
          right: -30,
          bottom: -30,
          left: -30
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

    return (
      <View style={styles.container}>
        <View style={styles.map}>
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

              return <MapMarker ending={ending} data={data} key={_id} />;
            })}
          </MapView>
          <CityPicker tabLabel="Closest" />
        </View>
        <MapLoading />
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
    height: HEIGHT * 0.31
  },
  map: {
    flex: 1
  }
});
