import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { navigate } from "../screens";
import Link from "./Link";
import EventView from "./EventView";
import ImageGallery from "./ImageGallery";
import { selectPlaceEvents } from "../store/events";
import { useSelector } from "react-redux";
import { WEB } from "../utils/Constants";
import { distanceTo } from "../utils/Locate";

export default memo(({ item: i, index, demo, section }) => {
  let item = i;
  if (demo) {
    item = {
      ...item,
      _source: {
        title: "Trivia",
        description: "7 round trivia, Gift cards for 1st, 2nd, & 3rd",
        location: "Mutt Lynch's",
        rating: 4.6,
        neighborhood: "Balboa Peninsula, Newport Beach"
      },
      sort: []
    };
  }

  const streetText = item._source.address.split(",")[0];
  const cityText = item._source.neighborhood || item._source.city;

  const onPress = () => {
    navigate("Detail", { id: item._id });
  };

  const placeEvents = useSelector(selectPlaceEvents(item));

  const hasMoreEvents = placeEvents.length > 1;

  const placeText = hasMoreEvents
    ? `${placeEvents.findIndex(e => e._id === item._id) + 1} of ${
        placeEvents.length
      }`
    : null;

  const distance = distanceTo(item);

  return (
    <View style={[styles.container]}>
      <Link to={`e/${item._id}`} style={styles.infoButton} onPress={onPress}>
        <View
          style={[
            styles.row,
            {
              marginBottom: 10,
              paddingHorizontal: 5,
              alignItems: "flex-start",
              marginTop: 10
            }
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.subtitleText}>{item._source.location}</Text>
            <Text style={styles.detailText}>
              {distance ? <Text>{distance.toFixed(1)} mi</Text> : null}{" "}
              {cityText}
            </Text>
          </View>
          {placeText && (
            <View style={styles.count}>
              <Text style={styles.countText}>{placeText}</Text>
            </View>
          )}
        </View>
        <ImageGallery height={110} photos={item._source.photos} />
        <EventView
          demo={demo}
          index={index}
          item={item}
          section={section}
          style={{ marginTop: 8 }}
        />
      </Link>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  infoButton: {
    paddingLeft: 10,
    paddingBottom: 8
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "600"
  },
  distanceText: {
    color: "#666",
    fontSize: 10
  },
  detailText: {
    fontSize: 12,
    color: "#555"
  },
  ratingText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5
  },
  additional: {
    marginLeft: 4,
    backgroundColor: "#bbb",
    paddingHorizontal: 2,
    borderRadius: 3,
    alignItems: "center"
  },
  additionalText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  },
  count: {
    marginLeft: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: "#fafafa"
  },
  countText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "700"
  }
});
