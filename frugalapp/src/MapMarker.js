import React, { Component } from "react";
import { StyleSheet, ScrollView, Image, View, Text } from "react-native";
import { MapView } from "expo";

export default class MapMarker extends Component {
  static imageHeight = 150;

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

    return (
      <MapView.Marker
        title={item.title}
        description={item.description}
        coordinate={coordinate}
        image={require("../assets/pin.png")}
      >
        <View style={styles.number}>
          <Text style={styles.numberText}>1</Text>
        </View>
        <MapView.Callout>
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
          <View style={styles.info}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.infoText}>{timeSpan}</Text>
            <Text style={styles.infoText}>{item.description}</Text>
          </View>
        </MapView.Callout>
      </MapView.Marker>
    );
  }
}

const styles = StyleSheet.create({
  number: {
    position: "absolute",
    top: 2,
    left: 0,
    width: 18,
    alignItems: "center",
    backgroundColor: "transparent"
  },
  numberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500"
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
    marginTop: 4
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
