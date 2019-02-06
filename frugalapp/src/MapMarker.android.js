import React, { PureComponent, Component } from "react";
import { StyleSheet, View, Text, WebView } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { MapView } from "expo";
import * as Events from "./store/events";
import { makeHours } from "./Time";
import { AWSCF } from "./Constants";

const redPin = require("../assets/pin.png");
const greenPin = require("../assets/pin-now.png");

export default class MapMarker extends PureComponent {
  static imageHeight = 120;
  static offset = { x: 0, y: -14 };

  render() {
    const { _source: item, ending } = this.props.data;

    const coordinate = {
      latitude: item.coordinates[1],
      longitude: item.coordinates[0]
    };

    const location = item.location
      .replace(/^(the |a )/gi, "")
      .replace(" ", "")
      .toUpperCase();

    const spot = `${location.slice(0, 2)}\n${location.slice(2, 4)}`;

    const pinSource = ending ? greenPin : redPin;

    return (
      <MapView.Marker
        coordinate={coordinate}
        image={pinSource}
        ref={ref => (this._marker = ref)}
        tracksViewChanges
        tracksInfoWindowChanges
      >
        <View style={styles.marker}>
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>
        <ConnectedCallout {...this.props} />
      </MapView.Marker>
    );
  }
}

class Callout extends Component {
  state = {
    height: MapMarker.imageHeight
  };

  _updateHeight = e => {
    const {
      nativeEvent: {
        layout: { height }
      }
    } = e;

    this.setState({
      height: height + MapMarker.imageHeight
    });
  };

  _renderInfo = () => {
    const { data } = this.props;

    const { _source: item } = data;

    if (data.type && data.type === "group") {
      return (
        <View style={styles.info} onLayout={this._updateHeight}>
          <Text style={styles.locationText}>{item.location}</Text>
          {data.events.map(event => {
            const { _source: item } = event;
            return (
              <View style={styles.event} key={event._id}>
                <Text style={styles.titleText}>{item.title}</Text>
                <View style={styles.hours}>
                  {item.groupedHours.map((hours, index) => {
                    return (
                      <View style={styles.hour} key={index}>
                        <View style={styles.days}>
                          {hours.days.map(day => {
                            return (
                              <View style={styles.day} key={day.text}>
                                <Text style={styles.dayText}>{day.text}</Text>
                              </View>
                            );
                          })}
                        </View>
                        <Text style={styles.hourText}>{hours.hours}</Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.infoText}>{item.description}</Text>
              </View>
            );
          })}
        </View>
      );
    } else {
      const hours = makeHours(item);

      return (
        <View style={styles.info} onLayout={this._updateHeight}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.infoText}>{hours}</Text>
          <Text style={styles.infoText}>{item.description}</Text>
        </View>
      );
    }
  };

  _onPress = () => {
    const { data, navigation, set } = this.props;

    set({
      selectedEvent: {
        data
      }
    });

    navigation.navigate("Info");
  };

  render() {
    const { disabled } = this.props;

    if (disabled) {
      return null;
    }

    const { _source: item } = this.props.data;

    const calloutStyle = {
      width: 250,
      height: this.state.height
    };

    const source =
      this.state.height === MapMarker.imageHeight
        ? null
        : { html: calloutHTML(item) };

    return (
      <MapView.Callout onPress={this._onPress}>
        <View style={calloutStyle} key={`${this.state.height}`}>
          <WebView style={{ height: MapMarker.imageHeight }} source={source} />
          {this._renderInfo()}
        </View>
      </MapView.Callout>
    );
  }
}

const ConnectedCallout = connect(
  null,
  {
    set: Events.actions.set
  }
)(withNavigation(Callout));

const calloutHTML = item => {
  const url = `${AWSCF}${item.photos[0].thumb.key}`;
  return `
    <html>
      <head>
      <style>
        html, body {
          margin: 0;
          padding: 0;
        }

        #img {
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      </style>
      </head>
      <body>
      <div id="img" style="background-image: url('${url}')"></div>
      </body>
    </html>
  `;
};

const styles = StyleSheet.create({
  marker: {
    width: 20,
    height: 28
  },
  spot: {
    position: "absolute",
    top: 4,
    left: 0,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  spotText: {
    paddingLeft: 1.5,
    lineHeight: 6,
    textAlign: "center",
    color: "#fff",
    fontSize: 6,
    fontWeight: "700"
  },
  info: {
    paddingTop: 4
  },
  event: {
    marginTop: 5
  },
  titleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  infoText: {
    fontSize: 12,
    color: "#444"
  },
  hours: {
    marginTop: 2
  },
  hour: {
    flexDirection: "row",
    alignItems: "center"
  },
  hourText: {
    color: "#444",
    fontSize: 12
  },
  days: {
    flexDirection: "row",
    marginRight: 3
  },
  day: {
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: "#18AB2E",
    marginRight: 2
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
