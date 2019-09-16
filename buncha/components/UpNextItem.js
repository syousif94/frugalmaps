import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { navigate } from "../screens";
import Link from "./Link";
import { selectPlaceEvents } from "../store/events";
import { useSelector } from "react-redux";
import { RED } from "../utils/Colors";
import { roundedDistanceTo } from "../utils/Locate";
import { AWSCF } from "../utils/Constants";
import { itemRemaining } from "../utils/Time";
import ImageGallery from "./ImageGallery";
import { Entypo, FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const itemWidth = (windowWidth - 39) / 2;

export default memo(({ item, index }) => {
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

  const distance = roundedDistanceTo(item);

  const time = itemRemaining(item);

  const photo = item._source.photos[0];

  const uri = `${AWSCF}${photo.thumb.key}`;

  return (
    <Link to={`e/${item._id}`} style={styles.container} onPress={onPress}>
      <View style={styles.image}>
        <ImageGallery photos={item._source.photos} height={70} />
      </View>
      <Text style={styles.subtitleText}>{time.span}</Text>
      <Text style={styles.subtitleText}>
        {item._source.location}{" "}
        <Text style={{ color: "#666" }}>{distance}</Text>
      </Text>
      <Text style={styles.titleText}>
        {item._source.title}
        <Text style={{ color: time.color, fontWeight: "700" }}>
          {" "}
          {time.text} {time.state}
        </Text>
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Entypo name="calendar" size={16} color={RED} />
          <Text style={styles.actionText}>Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { marginLeft: 10 }]}>
          <FontAwesome name="star" size={16} color={"#FFA033"} />
          <Text style={styles.actionText}>Interested</Text>
        </TouchableOpacity>
      </View>
    </Link>
  );
});

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    marginLeft: 13,
    paddingVertical: 10
  },
  image: {
    height: 70,
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 2
  },
  titleText: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: "700"
  },
  subtitleText: {
    marginVertical: 1,
    fontSize: 12,
    color: "#000",
    fontWeight: "600"
  },
  actions: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 32
  },
  actionText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  }
});
