import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { mapsApi } from "../utils/Google";

export default () => {
  const [item, setItem] = useState();
  const googleApi = useRef(null);
  const mapRef = useRef(null);
  const googleMap = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    const handleMap = async () => {
      if (!googleApi.current) {
        googleApi.current = await mapsApi;
      }

      if (!googleMap.current) {
        googleMap.current = new googleApi.current.maps.Map(mapRef.current, {
          zoom: 17,
          disableDefaultUI: true,
          zoomControl: false,
          scrollwheel: true
        });
      }

      if (item) {
        const [lng, lat] = item._source.coordinates;
        const coords = new googleApi.current.maps.LatLng(lat, lng);
        googleMap.current.setCenter(coords);
        if (!marker.current) {
          marker.current = new googleApi.current.maps.Marker({
            position: coords,
            map: googleMap.current
          });
        } else {
          marker.current.setPosition(coords);
        }
      }
    };

    handleMap();
  }, [item]);

  useEffect(() => {
    const handleMessage = e => {
      console.log(e);
      setItem(JSON.parse(e.data));
    };

    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <View style={styles.container}>
      <div style={{ flex: 1 }} ref={mapRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%"
  }
});
