import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { RED, BLUE } from "./Colors";
import { MapView, Linking } from "expo";
import { INITIAL_REGION } from "./Constants";
import { Entypo } from "@expo/vector-icons";

const mapStateToProps = state => ({
  place: state.submission.place,
  fid: state.submission.fid
});

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

  render() {
    const { place, fid } = this.props;

    if (fid && !place) {
      return (
        <View style={styles.loading}>
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
            showsMyLocationButton={false}
          />
          <Text style={styles.instruction}>Fetching restaurant info</Text>
        </View>
      );
    }

    if (!place) {
      return (
        <View style={styles.empty}>
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
            showsMyLocationButton={false}
          />
          <Text style={styles.instruction}>
            Swipe <Entypo name="chevron-right" size={16} color="#fff" /> to
            select a restaurant
          </Text>
        </View>
      );
    }

    const coordinate = {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
    };

    return (
      <View style={styles.container}>
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
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.formatted_address}</Text>
        <View style={styles.links}>
          <TouchableOpacity onPress={this._call} style={styles.callBtn}>
            <Text style={styles.phone}>{place.international_phone_number}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._website} style={styles.callBtn}>
            <Text style={styles.phone}>{place.website}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(PlacePreview);

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  map: {
    height: 190,
    borderRadius: 8,
    alignSelf: "stretch"
  },
  empty: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: RED,
    justifyContent: "center",
    alignItems: "center"
  },
  loading: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center"
  },
  instruction: {
    marginTop: 10,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center"
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
