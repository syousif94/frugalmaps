import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  ScrollView
} from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";
import ImageGallery from "./ImageGallery";
import { INITIAL_REGION, ANDROID, IOS, SafeArea, HEIGHT } from "./Constants";
import MapMarker from "./MapMarker";
import LocateButton from "./MapLocateButton";
import emitter from "tiny-emitter/instance";
import { Constants } from "expo";
import locate from "./Locate";
import InfoEventList from "./InfoEventList";
import { FontAwesome } from "@expo/vector-icons";
import InfoActions from "./InfoActions";
import * as Events from "./store/events";
import InfoHours from "./InfoHours";
import InfoBackButton from "./InfoBackButton";
import { getInset } from "./SafeAreaInsets";

class InfoScreen extends Component {
  static mapId = "infoScreen";

  state = {
    loading: true
  };

  componentDidMount() {
    const {
      event: { data, id }
    } = this.props;

    if (!data && id) {
      this.props.fetch({
        id
      });
    }

    this._loadingTimeout = setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 150);

    // if (IOS) {
    //   StatusBar.setBarStyle("light-content");
    // }

    emitter.on(InfoScreen.mapId, this._showLocation);
  }

  componentWillReceiveProps(next) {
    if (next.event.id !== this.props.event.id) {
      this.props.fetch({
        id: next.event.id
      });
    }
  }

  componentWillUnmount() {
    if (this._loadingTimeout) {
      clearTimeout(this._loadingTimeout);
    }

    emitter.off(InfoScreen.mapId, this._showLocation);

    // if (IOS) {
    //   StatusBar.setBarStyle("dark-content");
    // }

    emitter.emit("info-pop");
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

  _renderMap = () => {
    const {
      event: { data },
      authorized
    } = this.props;

    return (
      <View style={styles.map}>
        {this.state.loading ? null : (
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
        <InfoBackButton />
        {this.state.loading ? null : (
          <LocateButton mapId={InfoScreen.mapId} size="small" />
        )}
      </View>
    );
  };

  _focusedAnnotation = false;

  render() {
    const {
      event: { data }
    } = this.props;

    if (!data) {
      return (
        <View style={[styles.container, styles.loading]}>
          <ActivityIndicator style={styles.loading} size="large" color="#fff" />
        </View>
      );
    }

    const item = data._source;

    const sort = data.sort;

    let distanceText = "";

    if (sort && sort[sort.length - 1]) {
      distanceText = `${sort[sort.length - 1].toFixed(1)} miles`;
    }

    const streetAddress = item.address.split(",")[0];

    const contentStyle = {
      paddingTop: IOS ? getInset("top") : 0
    };

    return (
      <View style={styles.container}>
        {this.state.loading ? null : (
          <ScrollView
            style={styles.container}
            contentContainerStyle={contentStyle}
          >
            <ImageGallery
              backgroundColor="#fff"
              height={HEIGHT * 0.3}
              disabled
              doc={data}
            />
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Text style={styles.locationText}>
                  {item.location}{" "}
                  <Text style={styles.distanceText}>{distanceText}</Text>
                </Text>
                <Text style={styles.subText}>{streetAddress}</Text>
                <Text style={styles.subText}>
                  {item.neighborhood || item.city}
                </Text>
                <View style={styles.rating}>
                  <FontAwesome name="star" size={16} color="#FFA033" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
            </View>
            <View style={styles.events}>
              <InfoActions doc={data} />
              <InfoEventList placeid={data._source.placeid} tick />
              <InfoHours hours={data._source.hours} />
            </View>
            {this._renderMap()}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  event: state.events.selectedEvent,
  authorized: state.location.authorized
});

const mapActions = {
  fetch: Events.actions.fetch
};

export default connect(
  mapStateToProps,
  mapActions
)(InfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 10
  },
  headerInfo: {
    paddingRight: 60
  },
  locationText: {
    color: "#000",
    fontSize: 28,
    fontWeight: "600"
  },
  subText: {
    marginTop: 1,
    color: "#444",
    fontSize: 12
  },
  distanceText: {
    color: "#444",
    fontSize: 12
  },
  map: {
    height: HEIGHT * 0.45
  },
  events: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  rating: {
    position: "absolute",
    top: 5,
    right: 0,
    flexDirection: "row"
  },
  ratingText: {
    color: "#FFA033",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }
});
