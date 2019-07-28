import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { navigate } from "../screens";
import { FontAwesome } from "@expo/vector-icons";
import Link from "./Link";
import EventView from "./EventView";
import ImageGallery from "./ImageGallery";

export default ({ item: i, index, demo, section }) => {
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

  return (
    <View style={[styles.container]}>
      <ImageGallery height={90} photos={item._source.photos} />
      <Link to={`e/${item._id}`} style={styles.infoButton} onPress={onPress}>
        <View style={[styles.row, { marginBottom: 5, paddingHorizontal: 5 }]}>
          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <Text style={[styles.subtitleText, { marginRight: 6 }]}>
                {item._source.location}
              </Text>
            </View>
            <Text style={styles.detailText}>{streetText}</Text>
            <Text style={styles.detailText}>{cityText}</Text>
          </View>
        </View>
        <EventView demo={demo} index={index} item={item} section={section} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "#fff"
  },
  infoButton: {
    paddingHorizontal: 5,
    paddingTop: 8
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
  }
});
