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
import { INITIAL_REGION, ANDROID, HEIGHT, IOS, SafeArea } from "./Constants";
import MapMarker from "./MapMarker";
import LocateButton from "./MapLocateButton";
import emitter from "tiny-emitter/instance";
import { Constants } from "expo";
import locate from "./Locate";

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

    const galleryHeight = HEIGHT * 0.5;

    return (
      <View style={styles.map}>
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
        <View style={styles.padded}>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.infoText}>{item.city}</Text>
          <Text style={styles.boldText}>{item.title}</Text>
          <Text style={styles.infoText}>{item.description}</Text>
          <View style={styles.hours}>
            {item.groupedHours.map((hours, index) => {
              return (
                <View style={styles.hour} key={index}>
                  <View style={styles.days}>
                    {hours.days.map(day => {
                      return (
                        <View style={styles.day} key={day}>
                          <Text style={styles.dayText}>{day}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <Text style={styles.hourText}>{hours.hours}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  _focusedAnnotation = false;

  render() {
    const {
      event: { data }
    } = this.props;
    const galleryHeight = HEIGHT * 0.5;
    return (
      <View style={styles.container}>
        <SafeArea>
          <View style={styles.info}>
            {ANDROID && this.state.loading ? null : (
              <ImageGallery doc={data} disabled height={galleryHeight} />
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  },
  boldText: {
    marginTop: 10,
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  },
  infoText: {
    marginTop: 3,
    color: "#e0e0e0",
    fontSize: 12
  },
  hours: {
    marginTop: 10
  },
  hour: {
    flexDirection: "row",
    alignItems: "center"
  },
  hourText: {
    color: "#e0e0e0",
    fontSize: 12
  },
  days: {
    flexDirection: "row",
    marginRight: 3
  },
  day: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#18AB2E",
    marginRight: 2
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
