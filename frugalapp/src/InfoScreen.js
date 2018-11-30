import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";
import ImageGallery from "./ImageGallery";
import EventList from "./InfoEventList";
import { INITIAL_REGION, ANDROID, HEIGHT, IOS, SafeArea } from "./Constants";
import MapMarker from "./MapMarker";
import LocateButton from "./MapLocateButton";
import emitter from "tiny-emitter/instance";
import { Constants } from "expo";
import locate from "./Locate";
import InfoBackButton from "./InfoBackButton";

class InfoScreen extends Component {
  static mapId = "infoScreen";

  state = {
    loading: true
  };

  componentDidMount() {
    if (!this.props.event.data) {
    }

    if (ANDROID) {
      this._loadingTimeout = setTimeout(() => {
        this.setState({
          loading: false
        });
      }, 150);
    }

    if (IOS) {
      StatusBar.setBarStyle("light-content");
    }

    emitter.on(InfoScreen.mapId, this._showLocation);
  }

  componentWillUnmount() {
    if (this._loadingTimeout) {
      clearTimeout(this._loadingTimeout);
    }

    emitter.off(InfoScreen.mapId, this._showLocation);

    if (IOS) {
      StatusBar.setBarStyle("dark-content");
    }
  }

  _showLocation = async () => {
    const marker = this.props.event.data;
    const coords = [
      {
        latitude: marker._source.coordinates[1],
        longitude: marker._source.coordinates[0]
      }
    ];

    const {
      coords: { latitude, longitude }
    } = await locate();

    coords.push({
      latitude,
      longitude
    });

    this._map.fitToCoordinates(coords, {
      edgePadding: {
        top: IOS ? Constants.statusBarHeight + 10 : 0,
        left: 25,
        right: 25,
        bottom: 40
      }
    });
  };

  _focusAnnotation = () => {
    if (this._focusedAnnotation) {
      return;
    }

    this._focusedAnnotation = true;

    const viewport = this.props.event.data._source.viewport;

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
      this._map.fitToCoordinates(coords, { animated: false });
    });
  };

  _renderInfo = () => {
    const {
      event: { data },
      authorized
    } = this.props;

    if (!data) {
      return (
        <View style={[styles.info, styles.loading]}>
          <ActivityIndicator style={styles.loading} size="large" color="#444" />
        </View>
      );
    }

    const { _source: item } = data;

    return (
      <View style={styles.map}>
        <View>
          <EventList placeid={item.placeid} />
          <InfoBackButton />
        </View>
        <View style={styles.map}>
          {ANDROID && this.state.loading ? null : (
            <MapView
              ref={ref => (this._map = ref)}
              style={styles.map}
              initialRegion={INITIAL_REGION}
              onLayout={this._focusAnnotation}
              showsUserLocation={authorized}
            >
              <MapMarker data={data} key={data._id} disabled />
            </MapView>
          )}
          {ANDROID && this.state.loading ? null : (
            <LocateButton mapId={InfoScreen.mapId} size="small" />
          )}
        </View>
      </View>
    );
  };

  _focusedAnnotation = false;

  render() {
    const {
      event: { data }
    } = this.props;

    const { _source: item } = data;
    const galleryHeight = HEIGHT * 0.5;
    return (
      <View style={styles.container}>
        <SafeArea>
          <View style={styles.padded}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.infoText}>{item.city}</Text>
          </View>
          <View style={styles.info}>
            {ANDROID && this.state.loading ? null : (
              <ImageGallery
                backgroundColor="#000"
                doc={data}
                disabled
                height={galleryHeight}
              />
            )}
          </View>
        </SafeArea>
        {this._renderInfo()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  event: state.events.selectedEvent,
  authorized: state.location.authorized
});

export default connect(mapStateToProps)(InfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  map: {
    flex: 1
  },
  info: {
    height: HEIGHT * 0.5
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  },
  padded: {
    backgroundColor: "rgba(0,0,0,1)",
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  },
  infoText: {
    marginTop: 3,
    color: "#e0e0e0",
    fontSize: 12
  }
});
