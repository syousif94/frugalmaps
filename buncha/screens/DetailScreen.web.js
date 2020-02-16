import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, Text, Animated, ScrollView } from "react-native";
import { getEvent } from "../store/events";
import { Helmet } from "react-helmet";
import { useDimensions } from "../utils/Hooks";
import { useMap } from "../utils/MapKit";
import DetailActions from "../components/DetailActions";
import PriceText from "../components/PriceText";
import ImageWall from "../components/ImageWall";

export default ({ navigation }) => {
  const id = navigation.getParam("id", null);

  const item = useSelector(state => (id ? state.events.data[id] : null));

  const [preloaded] = useState(!!item);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!item) {
      dispatch(getEvent(id));
    }
  }, []);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Helmet>
        <title>{item ? `${item._source.location} - Buncha` : "Loading"}</title>
      </Helmet>
      {item ? (
        <DetailView item={item} preloaded={preloaded} />
      ) : (
        <LoadingView />
      )}
    </View>
  );
};

const DetailView = ({ preloaded, item }) => {
  const [dimensions] = useDimensions();

  if (dimensions.width > 850) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }} pointerEvents="box-none">
        {preloaded ? (
          <View style={{ flex: 1 }} pointerEvents="none" />
        ) : (
          <DetailMapView item={item} />
        )}
        <View style={{ width: 400, backgroundColor: "#fff" }}>
          <ScrollView>
            <DetailSidebar item={item} />
          </ScrollView>
        </View>
      </View>
    );
  }

  const mapHeight = dimensions.height * 0.7;

  return (
    <Animated.ScrollView style={{ backgroundColor: "#fff" }}>
      <View
        style={{
          paddingTop: mapHeight,
          minHeight: mapHeight + dimensions.height,
          backgroundColor: "#fff"
        }}
      >
        <DetailSidebar item={item} />
      </View>
      <Animated.View
        style={{
          height: mapHeight,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <DetailMapView item={item} />
      </Animated.View>
    </Animated.ScrollView>
  );
};

const DetailMapView = ({ item }) => {
  const mapRef = useRef(null);

  const [map] = useMap(mapRef);

  useEffect(() => {
    if (!map) {
      return;
    }

    const bounds = item._source.viewport;

    const region = new mapkit.BoundingRegion(
      bounds.northeast.lat,
      bounds.northeast.lng,
      bounds.southwest.lat,
      bounds.southwest.lng
    ).toCoordinateRegion();

    requestAnimationFrame(() => {
      map.region = region;
    });
  }, [map]);

  return (
    <View style={{ flex: 1 }}>
      <div style={{ flex: 1 }} ref={mapRef} />
    </View>
  );
};

const DetailSidebar = ({ item }) => {
  return (
    <View>
      <DetailActions item={item} />
      <View style={{ alignSelf: "center", maxWidth: 500, width: "100%" }}>
        <View style={{ paddingHorizontal: 14 }}>
          <Text style={{ fontSize: 20, color: "#000", fontWeight: "700" }}>
            {item._source.location}
            <PriceText
              priceLevel={item._source.priceLevel}
              prefix=" "
              style={{
                fontSize: 16,
                fontWeight: "700"
              }}
            />
          </Text>
          <Text style={{ fontSize: 15, color: "#555", marginTop: 3 }}>
            {item._source.address}
          </Text>
        </View>
        <View style={{ marginHorizontal: 2 }}>
          <ImageWall photos={item._source.photos} />
        </View>
      </View>
    </View>
  );
};

const LoadingView = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10
  }
});
