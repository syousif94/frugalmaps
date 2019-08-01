import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import MapMarker from "./MapMarker";

export default ({ place, style }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const bounds = place.geometry.viewport;
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
          bottom: 50
        }
      });
    });
  }, [place]);

  return (
    <View style={style} pointerEvents="none">
      <MapView style={{ flex: 1 }} ref={mapRef}>
        <MapMarker
          data={{
            _source: {
              location: place.name,
              coordinates: [
                place.geometry.location.lng,
                place.geometry.location.lat
              ]
            }
          }}
        />
      </MapView>
    </View>
  );
};
