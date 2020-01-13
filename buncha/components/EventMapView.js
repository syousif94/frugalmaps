import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import MapView from "react-native-maps";
import Marker from "./MapMarker";
import { useSelector } from "react-redux";
import locate, { distanceTo } from "../utils/Locate";
import { getInset } from "../utils/SafeAreaInsets";

export default ({ item, style = {} }) => {
  const mapRef = useRef(null);
  const locationEnabled = useSelector(state => state.permissions.location);

  useEffect(() => {
    if (!item) {
      return;
    }

    const onItem = async () => {
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

      if (locationEnabled && distanceTo(item) < 50) {
        const { coords: userLocation } = await locate();
        coords.push(userLocation);
      }

      const dimensions = Dimensions.get("window");

      const padding =
        (dimensions.height * 0.76 - dimensions.height * 0.45) / 2 + 20;

      requestAnimationFrame(() => {
        mapRef.current.fitToCoordinates(coords, {
          animated: false,
          edgePadding: {
            top: getInset("top") + padding + 30,
            left: 20,
            right: 20,
            bottom: padding
          }
        });
      });
    };

    onItem();
  }, [item, locationEnabled]);

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
        showsUserLocation={locationEnabled}
      >
        <Marker data={item} />
      </MapView>
    </Animated.View>
  );
};
