import React, { Component } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { connect } from "react-redux";
import MapView from "react-native-maps";
import { selectEvent, deselectEvent } from "../store/events";
import { ANDROID } from "../utils/Constants";
import emitter from "tiny-emitter/instance";
import { UPCOMING, NOW } from "../utils/Colors";

const redSelectedPin = require("../assets/pin-selected.png");
const greenSelectedPin = require("../assets/pin-now-selected.png");
const orangeSelectedPin = require("../assets/pin-upcoming-selected.png");

class MapMarker extends Component {
  static imageHeight = 150;
  static miniScale = 0.68;
  static offset = { x: 0, y: -28 * MapMarker.miniScale };

  state = {
    selected: false
  };

  componentDidMount() {
    emitter.on("select-marker", this._handleSelect);
  }

  componentWillUnmount() {
    emitter.off("select-marker", this._handleSelect);
    emitter.off("deselect-marker", this._onDeselect);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.selected !== nextState.selected ||
      nextProps.data._id !== this.props.data._id ||
      nextProps.color !== this.props.color
    );
  }

  _handleSelect = id => {
    const notMarker = this.props.data._source.placeid !== id;
    const selected = this.state.selected;
    if (!ANDROID && selected && notMarker) {
      this._marker.hideCallout();
      this._onDeselect();
    }
    if (notMarker) {
      return;
    }
    if (!selected) {
      this._marker.showCallout();
      if (ANDROID) {
        this._onSelect();
      }
    }
  };

  _onSelect = () => {
    if (ANDROID) {
      emitter.emit("deselect-marker");
      emitter.on("deselect-marker", this._onDeselect);
    }
    this.setState({
      selected: true
    });
    this.props.selectEvent(this.props.data._id);
  };

  _onDeselect = () => {
    this.props.deselectEvent(this.props.data._id);
    this.setState({
      selected: false
    });
    if (ANDROID) {
      emitter.off("deselect-marker", this._onDeselect);
    }
  };

  _setRef = ref => {
    this._marker = ref;
  };

  render() {
    const {
      data: { _source: item },
      color,
      time,
      day
    } = this.props;

    const coordinate = {
      latitude: item.coordinates[1],
      longitude: item.coordinates[0]
    };

    let spot;
    let location;
    if (time) {
      spot = time;
      location = item.location.replace(/^(the |a )/gi, "").substr(0, 4);
    } else {
      const text = item.location
        .replace(/^(the |a )/gi, "")
        .substr(0, 4)
        .toUpperCase();
      spot = `${text.substr(0, 2)}\n${text.substr(2, 4)}`;
    }

    const markerStyle = [styles.marker];
    const imageStyle = [styles.image];
    const spotStyle = [styles.spot];
    const spotTextStyle = [styles.spotText];
    let offset = MapMarker.offset;
    let pinSource;
    switch (color) {
      case NOW:
        pinSource = greenSelectedPin;
        break;
      case UPCOMING:
        pinSource = orangeSelectedPin;
        break;
      default:
        pinSource = redSelectedPin;
    }

    if (this.state.selected) {
      markerStyle.push(styles.selectedMarker);
      offset = { x: 0, y: -28 };
    }

    const androidProps = ANDROID
      ? {
          onPress: this._onSelect,
          tracksViewChanges: true
        }
      : {};

    return (
      <MapView.Marker
        coordinate={coordinate}
        centerOffset={offset}
        ref={this._setRef}
        onSelect={this._onSelect}
        onDeselect={this._onDeselect}
        identifier={item.placeid}
        {...androidProps}
      >
        <View style={markerStyle}>
          <Image source={pinSource} style={imageStyle} />
          <View style={spotStyle}>
            {time ? (
              <Text allowFontScaling={false} style={styles.indexText}>
                {location}
              </Text>
            ) : null}
            <Text allowFontScaling={false} style={spotTextStyle}>
              {spot}
            </Text>
          </View>
        </View>
      </MapView.Marker>
    );
  }
}

export default connect(null, {
  selectEvent,
  deselectEvent
})(MapMarker);

const styles = StyleSheet.create({
  marker: {
    width: 40,
    height: 56,
    transform: [{ scale: MapMarker.miniScale }]
  },
  selectedMarker: {
    zIndex: 2,
    transform: [{ scale: 1 }]
  },
  image: {
    width: 40,
    height: 56
  },
  spot: {
    position: "absolute",
    top: 8,
    width: 36,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  indexText: {
    paddingLeft: 3,
    marginBottom: 0.5,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 10,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "transparent"
  },
  spotText: {
    paddingLeft: 3,
    lineHeight: 13,
    fontSize: 13,
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    backgroundColor: "transparent"
  }
});
