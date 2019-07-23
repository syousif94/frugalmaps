import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../screens";
import { FontAwesome } from "@expo/vector-icons";
import Link from "./Link";
import EventView from "./EventView";

export default ({ item: i, index, demo, section }) => {
  let item = i;
  if (demo) {
    item = {
      ...item,
      _source: {
        title: "Trivia",
        description: "7 round trivia, Prizes for winners",
        location: "Mutt Lynch's",
        rating: 4.6,
        neighborhood: "Balboa Peninsula, Newport Beach"
      },
      sort: []
    };
  }

  const placeEvents = useSelector(
    state => state.events.places[item._source.placeid]
  );
  const additionalEvents = demo ? 3 : placeEvents && placeEvents.length - 1;

  let cityText = item._source.neighborhood || item._source.city;
  if (item.sort && item.sort[item.sort.length - 1]) {
    cityText = `${cityText} · ${item.sort[item.sort.length - 1].toFixed(1)} mi`;
  }

  const onPress = () => {
    navigate("Detail", { id: item._id });
  };
  return (
    <View style={[styles.container]}>
      <Link to={`e/${item._id}`} style={styles.infoButton} onPress={onPress}>
        <View style={[styles.row, { marginBottom: 7 }]}>
          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <Text style={styles.subtitleText}>{item._source.location}</Text>
              {additionalEvents === 0 ? null : (
                <View style={styles.additional}>
                  <Text style={styles.additionalText}>+{additionalEvents}</Text>
                </View>
              )}
            </View>
            <Text style={styles.detailText}>{cityText}</Text>
          </View>
          <View style={styles.rating}>
            <FontAwesome name="star" size={14} color="#FFA033" />
            <Text style={styles.ratingText}>
              {parseFloat(item._source.rating, 10).toFixed(1)}
            </Text>
          </View>
        </View>
        <EventView demo={demo} index={index} item={item} section={section} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  infoButton: {
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: "600"
  },
  detailText: {
    fontSize: 12,
    color: "#444"
  },
  rating: {
    flexDirection: "row",
    alignItems: "center"
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
  }
});
