import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  ImageBackground
} from "react-native";
import { MapView } from "expo";

export default class MapMarker extends Component {
  static imageHeight = 150;

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

  render() {
    const { _source: item } = this.props.data;

    const coordinate = {
      latitude: item.coordinates[1],
      longitude: item.coordinates[0]
    };

    let timeSpan;

    if (item.start && item.end) {
      timeSpan = `${item.start} - ${item.end}`;
    } else if (item.start) {
      timeSpan = `Starts at ${item.start}`;
    } else if (item.end) {
      timeSpan = `Ends at ${item.end}`;
    } else {
      timeSpan = `All Day`;
    }

    const location = item.location
      .replace(/^(the |a )/gi, "")
      .replace(" ", "")
      .toUpperCase();

    const spot = `${location.slice(0, 2)}\n${location.slice(2, 4)}`;

    return (
      <MapView.Marker coordinate={coordinate}>
        <View style={styles.marker}>
          <Image source={require("../assets/pin.png")} style={styles.marker} />
          <View style={styles.spot}>
            <Text style={styles.spotText}>{spot}</Text>
          </View>
        </View>

        <MapView.Callout>
          <View
            style={{
              width: 250,
              height: this.state.height
            }}
          >
            <ScrollView style={styles.images} horizontal>
              {item.photos.map(photo => {
                const { url: uri, height, width } = photo;

                const source = {
                  uri
                };

                const imageWidth = (MapMarker.imageHeight / height) * width;

                return (
                  <Image
                    key={uri}
                    source={source}
                    style={[styles.image, { width: imageWidth }]}
                  />
                );
              })}
            </ScrollView>
            <View style={styles.info} onLayout={this._updateHeight}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.locationText}>{item.location}</Text>
              <Text style={styles.infoText}>{timeSpan}</Text>
              <Text style={styles.infoText}>{item.description}</Text>
            </View>
          </View>
        </MapView.Callout>
      </MapView.Marker>
    );
  }
}

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
  images: {
    width: 250,
    height: MapMarker.imageHeight,
    backgroundColor: "#f2f2f2"
  },
  image: {
    resizeMode: "contain",
    height: MapMarker.imageHeight,
    backgroundColor: "#e0e0e0",
    marginRight: 2
  },
  info: {
    paddingTop: 4
  },
  titleText: {
    fontWeight: "600",
    color: "#000"
  },
  locationText: {
    fontSize: 12
  },
  infoText: {
    fontSize: 12,
    color: "#444"
  }
});
