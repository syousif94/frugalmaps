import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import Marker from "./MapMarker";

export default ({ item }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!item) {
      return;
    }
    const bounds = item._source.viewport;
    const coords = [
      {
        latitude: bounds.northeast.lat,
        longitude: bounds.northeast.lng
      },
      {
        latitude: bounds.southwest.lat,
        longitude: bounds.southwest.lng
      }
    ];
    requestAnimationFrame(() => {
      mapRef.current.fitToCoordinates(coords, {
        animated: false,
        edgePadding: {
          top: 50,
          left: 50,
          right: 50,
          bottom: 0
        }
      });
    });
  }, [item]);

  return (
    <View
      style={{
        height: 160,
        borderRadius: 8,
        margin: 10,
        overflow: "hidden"
      }}
    >
      <MapView
        ref={mapRef}
        style={{
          flex: 1,
          borderRadius: 8
        }}
      >
        <Marker data={item} />
      </MapView>
    </View>
  );
};
