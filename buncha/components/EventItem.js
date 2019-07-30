import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { navigate } from "../screens";
import Link from "./Link";
import EventView from "./EventView";
import ImageGallery from "./ImageGallery";
import { selectPlaceEvents } from "../store/events";
import { useSelector } from "react-redux";
import { WEB } from "../utils/Constants";

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

  return (
    <View style={[styles.container]}>
      <ImageGallery height={90} photos={item._source.photos} />
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
            <View style={styles.row}>
              <Text style={[styles.subtitleText, { marginRight: 6 }]}>
                {item._source.location}
              </Text>
            </View>
            <Text style={styles.detailText}>{streetText}</Text>
            <Text style={styles.detailText}>{cityText}</Text>
          </View>
          {placeText && (
            <View style={styles.count}>
              <Text style={styles.countText}>{placeText}</Text>
            </View>
          )}
        </View>
        <EventView demo={demo} index={index} item={item} section={section} />
      </Link>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "#fff"
  },
  infoButton: {
    paddingHorizontal: 10,
    paddingTop: 8
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: "600"
  },
  detailText: {
    fontSize: 14,
    color: "#000"
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
