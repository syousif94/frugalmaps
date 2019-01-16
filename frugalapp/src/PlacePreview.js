import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import { RED, BLUE } from "./Colors";
import { MapView, Linking } from "expo";
import { INITIAL_REGION } from "./Constants";
import * as Submission from "./store/submission";
import RestaurantPicker from "./RestaurantPicker";
import SubmissionsButton from "./SubmissionsButton";

const mapStateToProps = state => ({
  place: state.submission.place,
  fid: state.submission.fid
});

const mapDispatchToProps = {
  reset: Submission.actions.reset
};

class PlacePreview extends Component {
  componentDidUpdate(previous) {
    const { place } = this.props;

    if (place && previous.place !== place) {
      const viewport = place.geometry.viewport;
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
    }
  }

  _call = () => {
    const { place } = this.props;

    if (!place || !place.international_phone_number) {
      return;
    }

    const url = `tel:${place.international_phone_number}`;
    Linking.openURL(url).catch(err => console.log(err));
  };

  _website = () => {
    const { place } = this.props;

    if (!place || !place.website) {
      return;
    }

    Linking.openURL(place.website).catch(err => console.log(err));
  };

  _reset = () => {
    Alert.alert(
      "Clear this form?",
      "The restaurant and any input will be reset",
      [
        {
          text: "Clear",
          onPress: () => {
            this.props.reset();
          },
          style: "destructive"
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  render() {
    const { place, fid } = this.props;

    if (fid && !place) {
      return (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            zoomEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
            pointerEvents="none"
            initialRegion={INITIAL_REGION}
            showsCompass={false}
            toolbarEnabled={false}
            showsUserLocation
            showsMyLocationButton={false}
          />
          <View style={styles.instruction}>
            <Text style={styles.instructionText}>Fetching restaurant info</Text>
          </View>
          <View style={styles.reset}>
            <TouchableOpacity style={styles.resetBtn} onPress={this._reset}>
              <Text style={styles.instructionText}>Clear Form</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (!place) {
      return (
        <View style={styles.container}>
          <View>
            <MapView
              style={styles.map}
              zoomEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              pitchEnabled={false}
              pointerEvents="none"
              initialRegion={INITIAL_REGION}
              showsCompass={false}
              toolbarEnabled={false}
              showsUserLocation
              showsMyLocationButton={false}
            />
            <SubmissionsButton />
            <View style={styles.reset}>
              <TouchableOpacity style={styles.resetBtn} onPress={this._reset}>
                <Text style={styles.instructionText}>Clear Form</Text>
              </TouchableOpacity>
            </View>
          </View>
          <RestaurantPicker />
        </View>
      );
    }

    const coordinate = {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
    };

    return (
      <View style={styles.container}>
        <View>
          <MapView
            ref={ref => (this._map = ref)}
            style={styles.map}
            zoomEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
            pointerEvents="none"
            showsCompass={false}
            toolbarEnabled={false}
            showsUserLocation
            showsMyLocationButton={false}
          >
            <MapView.Circle
              strokeColor="#fff"
              fillColor={RED}
              radius={18}
              strokeWidth={2}
              center={coordinate}
            />
          </MapView>
          <SubmissionsButton />
          <View style={styles.reset}>
            <TouchableOpacity onPress={this._reset} style={styles.resetBtn}>
              <Text style={styles.instructionText}>Clear Form</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.formatted_address}</Text>
        <View style={styles.links}>
          <TouchableOpacity onPress={this._call} style={styles.callBtn}>
            <Text numberOfLines={1} style={styles.phone}>
              {place.international_phone_number}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._website} style={styles.callBtn}>
            <Text numberOfLines={1} style={styles.phone}>
              {place.website}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacePreview);

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  map: {
    height: 190,
    borderRadius: 8,
    alignSelf: "stretch"
  },
  instruction: {
    height: 26,
    position: "absolute",
    top: 5,
    left: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  reset: {
    height: 26,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  resetBtn: {
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  instructionText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff"
  },
  name: {
    marginTop: 5,
    fontWeight: "500"
  },
  address: {
    marginTop: 2,
    color: "#555"
  },
  links: {
    marginTop: 2,
    flexDirection: "row"
  },
  callBtn: {
    marginRight: 15
  },
  phone: {
    color: BLUE
  }
});
