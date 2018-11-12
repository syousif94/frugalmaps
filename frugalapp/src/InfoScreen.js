import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";
import ImageGallery from "./ImageGallery";
import { INITIAL_REGION, ANDROID, HEIGHT, DAYS, ISO_DAYS } from "./Constants";
import MapMarker from "./MapMarker";
import { makeHours } from "./Time";
import { RED } from "./Colors";

class InfoScreen extends Component {
  state = {
    mapType: "standard",
    loading: true
  };

  componentDidMount() {
    if (!this.props.event.data) {
    }

    if (ANDROID) {
      this._loadingTimeout = setTimeout(this.setState, 400, { loading: false });
    }
  }

  componentWillUnmount() {
    if (this._loadingTimeout) {
      clearTimeout(this._loadingTimeout);
    }
  }

  _focusAnnotation = () => {
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

    this._map.fitToCoordinates(coords, { animated: false });
  };

  _renderInfo = () => {
    const {
      event: { data }
    } = this.props;

    if (!data) {
      return (
        <View style={[styles.info, styles.loading]}>
          <ActivityIndicator style={styles.loading} size="large" color="#444" />
        </View>
      );
    }

    const { _source: item } = data;

    const hours = item.days.reduce((acc, day) => {
      const text = DAYS[day];
      const iso = ISO_DAYS[day];
      const hours = makeHours(item, iso);

      const matchingHours = acc.find(val => val.hours === hours);

      if (matchingHours) {
        matchingHours.days.push(text);
      } else {
        acc.push({
          days: [text],
          hours
        });
      }

      return acc;
    }, []);

    return (
      <View style={styles.info}>
        <View style={styles.padded}>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.infoText}>{item.city}</Text>
          <Text style={styles.boldText}>{item.title}</Text>
          <Text style={styles.infoText}>{item.description}</Text>
          <View style={styles.hours}>
            {hours.map((hours, index) => {
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
        <ImageGallery doc={data} disabled height={220} />
      </View>
    );
  };

  render() {
    const {
      event: { data }
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.map}>
          {ANDROID && this.state.loading ? null : (
            <MapView
              ref={ref => (this._map = ref)}
              style={styles.map}
              initialRegion={INITIAL_REGION}
              mapType={this.state.mapType}
              onMapReady={this._focusAnnotation}
            >
              <MapMarker data={data} key={data._id} disabled />;
            </MapView>
          )}
        </View>
        {this._renderInfo()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  event: state.events.selectedEvent
});

export default connect(mapStateToProps)(InfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    flex: 1
  },
  info: {
    height: HEIGHT * 0.6
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  },
  padded: {
    padding: 20,
    flex: 1
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  boldText: {
    marginTop: 10,
    fontSize: 12,
    color: "#000",
    fontWeight: "600"
  },
  infoText: {
    marginTop: 3,
    color: "#444",
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
    color: "#444",
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
