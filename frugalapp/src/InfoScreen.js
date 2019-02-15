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

class InfoScreen extends Component {
  static mapId = "infoScreen";

  state = {
    loading: true,
    listTop: null
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

    if (IOS) {
      StatusBar.setBarStyle("light-content");
    }

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

  _onHeaderLayout = e => {
    const {
      nativeEvent: {
        layout: { y, height }
      }
    } = e;

    const listTop = y + height;

    this.setState({
      listTop
    });
  };

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

    const paddingStyle = {
      height: this.state.listTop * 3,
      backgroundColor: "#000",
      marginTop: this.state.listTop * -2
    };

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          {this.state.loading || (IOS && !this.state.listTop) ? null : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              style={styles.container}
            >
              <View style={paddingStyle} />
              <ImageGallery
                backgroundColor="#000"
                height={HEIGHT * 0.24}
                disabled
                doc={data}
              />
              <View style={styles.events}>
                <InfoActions doc={data} />
                <InfoEventList placeid={data._source.placeid} tick />
                <InfoHours hours={data._source.hours} />
              </View>
            </ScrollView>
          )}
        </View>
        {this._renderMap()}
        <SafeArea style={styles.headerContainer}>
          <View style={styles.header} onLayout={this._onHeaderLayout}>
            <View style={styles.headerInfo}>
              <Text style={styles.locationText}>
                {item.location}{" "}
                <Text style={styles.distanceText}>{distanceText}</Text>
              </Text>
              <Text style={styles.subText}>{item.city}</Text>
              <Text style={styles.subText}>{streetAddress}</Text>
              <View style={styles.rating}>
                <FontAwesome name="star" size={16} color="#FFA033" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          </View>
        </SafeArea>
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
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  header: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: ANDROID ? 5 : 0
  },
  scrollContent: {
    paddingBottom: 20
  },
  headerInfo: { paddingRight: 60 },
  locationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  subText: {
    color: "#e0e0e0",
    fontSize: 12
  },
  distanceText: {
    color: "#e0e0e0",
    fontSize: 12
  },
  map: {
    height: HEIGHT * 0.22
  },
  events: {
    marginTop: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  info: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#000"
  },
  rating: {
    position: "absolute",
    top: 2,
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
