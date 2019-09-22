import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import MapView from "react-native-maps";
import Marker from "./MapMarker";

export default ({ item, style = {} }) => {
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
          top: 40,
          left: 150,
          right: 150,
          bottom: 0
        }
      });
    });
  }, [item]);

  return (
    <Animated.View
      style={{
        overflow: "hidden",
        ...style
      }}
    >
      <MapView
        ref={mapRef}
        style={{
          flex: 1
        }}
      >
        <Marker data={item} />
      </MapView>
    </Animated.View>
  );
};
