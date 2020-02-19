import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, Animated, StyleSheet, ScrollView } from "react-native";
import { getEvent, selectPlaceEvents } from "../store/events";
import { Helmet } from "react-helmet";
import { useDimensions } from "../utils/Hooks";
import DetailMapView from "../components/DetailMapView";
import DetailActions from "../components/DetailActions";
import PriceText from "../components/PriceText";
import ImageWall from "../components/ImageWall";
import { FontAwesome } from "@expo/vector-icons";
import EventView from "../components/EventView";

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

  const events = useSelector(selectPlaceEvents(item, true));

  if (dimensions.width > 850) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }} pointerEvents="box-none">
        {preloaded ? (
          <View style={{ flex: 1 }} pointerEvents="none" />
        ) : (
          <DetailMapView events={events} preloaded={preloaded} />
        )}
        <View style={{ width: 400, backgroundColor: "#fff" }}>
          <ScrollView>
            <DetailSidebar events={events} />
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
        <DetailSidebar events={events} />
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
        <DetailMapView events={events} preloaded={preloaded} />
      </Animated.View>
    </Animated.ScrollView>
  );
};

const DetailSidebar = ({ events }) => {
  const item = events[0];

  return (
    <View>
      <DetailActions item={item} />
      <View style={[styles.sidebarContent, { paddingHorizontal: 14 }]}>
        <Text style={{ fontSize: 20, color: "#000", fontWeight: "700" }}>
          {item._source.location}
          <PriceText
            priceLevel={item._source.priceLevel}
            prefix=" "
            style={{
              fontSize: 17,
              fontWeight: "700"
            }}
          />
          <Text style={{ fontSize: 17, fontWeight: "700", marginLeft: 5 }}>
            <FontAwesome name="star" size={17} color="#FFA033" />
            <Text style={{ marginLeft: 4 }}>{item._source.rating}</Text>
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#555",
            marginTop: 3,
            fontWeight: "500"
          }}
        >
          {item._source.address}
        </Text>
      </View>

      <View style={[styles.sidebarContent, { padding: 7 }]}>
        {events.map((item, index) => {
          return <EventView item={item} index={index} key={`${index}`} />;
        })}
      </View>

      <View style={[styles.sidebarContent, { paddingHorizontal: 2 }]}>
        <ImageWall photos={item._source.photos} />
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
  },
  sidebarContent: {
    alignSelf: "center",
    maxWidth: 500,
    width: "100%"
  }
});
