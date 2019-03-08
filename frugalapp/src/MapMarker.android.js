import React, { PureComponent, Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { MapView } from "expo";
import * as Events from "./store/events";
import { makeHours } from "./Time";
import { AWSCF } from "./Constants";
import emitter from "tiny-emitter/instance";

const redPin = require("../assets/pin.png");
const greenPin = require("../assets/pin-now.png");
const orangePin = require("../assets/pin-upcoming.png");

export default class MapMarker extends PureComponent {
  static imageHeight = 60;
  static offset = { x: 0, y: -14 };

  componentDidMount() {
    emitter.on("fit-marker", this._fitMarker);
    emitter.on("hide-callouts", this._hideCallout);
  }

  componentWillUnmount() {
    emitter.off("fit-marker", this._fitMarker);
    emitter.off("hide-callouts", this._hideCallout);
  }

  _visibleCallout = false;

  _hideCallout = () => {
    if (this._visibleCallout) {
      this._visibleCallout = false;
      this._marker.hideCallout();
    }
  };

  _fitMarker = doc => {
    const {
      _source: { placeid }
    } = doc;

    if (placeid === this.props.data._source.placeid) {
      this._visibleCallout = true;
      this._marker.showCallout();
    }
  };
  _setRef = ref => {
    this._marker = ref;
  };

  render() {
    const {
      data: { _source: item },
      ending,
      upcoming,
      expanded
    } = this.props;

    const coordinate = {
      latitude: item.coordinates[1],
      longitude: item.coordinates[0]
    };

    const location = item.location
      .replace(/^(the |a )/gi, "")
      .replace(" ", "")
      .toUpperCase();

    const spot = `${location.slice(0, 2)}\n${location.slice(2, 4)}`;

    const pinSource = ending ? greenPin : upcoming ? orangePin : redPin;

    let markerProps;

    if (expanded) {
      markerProps = {};
    } else {
      const streetText = item.address
        .split(",")
        .find(val => val.length > 5)
        .trim();
      markerProps = {
        title: item.location,
        description: streetText
      };
    }

    return (
      <MapView.Marker
        coordinate={coordinate}
        image={pinSource}
        ref={this._setRef}
        {...markerProps}
      >
        <View style={styles.marker}>
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>
        {expanded ? <ConnectedCallout {...this.props} /> : null}
      </MapView.Marker>
    );
  }
}

class Callout extends Component {
  state = {
    height: 0 // MapMarker.imageHeight
  };

  _updateHeight = e => {
    const {
      nativeEvent: {
        layout: { height }
      }
    } = e;

    this.setState({
      height: height // + MapMarker.imageHeight
    });
  };

  _renderInfo = () => {
    const { data } = this.props;

    const { _source: item } = data;

    const streetText = item.address
      .split(",")
      .find(val => val.length > 5)
      .trim();

    if (data.type && data.type === "group") {
      return (
        <View style={styles.info}>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.infoText}>{streetText}</Text>
          {data.events.map((event, index) => {
            const { _source: item } = event;
            return (
              <View style={styles.event} key={event._id}>
                <Text style={styles.titleText}>
                  {index + 1}. {item.title}
                </Text>
                <Text style={styles.infoText}>{item.description}</Text>
                <View style={styles.hours}>
                  {item.groupedHours.map((hours, index) => {
                    return (
                      <View style={styles.hour} key={index}>
                        <Text style={styles.hourText}>{hours.hours}</Text>
                        <View style={styles.days}>
                          {hours.days.map(day => {
                            return (
                              <View style={styles.day} key={day.text}>
                                <Text style={styles.dayText}>{day.text}</Text>
                                {day.daysAway ? (
                                  <View style={styles.daysAway}>
                                    <Text style={styles.dayText}>
                                      {day.daysAway}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      const hours = makeHours(item);

      return (
        <View style={styles.info}>
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
      width: 250
    };

    // const source =
    //   this.state.height === MapMarker.imageHeight
    //     ? null
    //     : { html: calloutHTML(item) };

    return (
      <MapView.Callout onPress={this._onPress}>
        <View style={calloutStyle}>
          {/* <WebView style={{ height: MapMarker.imageHeight }} source={source} /> */}
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
  info: {},
  event: {
    marginTop: 3
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
    marginBottom: 3
  },
  hourText: {
    color: "#444",
    fontSize: 12
  },
  days: {
    flexDirection: "row",
    marginTop: 3
  },
  day: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: "#18AB2E",
    marginRight: 2
  },
  daysAway: {
    marginLeft: 2,
    marginRight: -1,
    paddingHorizontal: 2,
    borderRadius: 2.5,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
