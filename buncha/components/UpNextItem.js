import React, { memo, useEffect } from "react";
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
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { RED } from "../utils/Colors";
import { roundedDistanceTo } from "../utils/Locate";
import {
  itemRemaining,
  itemRemainingAtTime,
  itemTimeForDay
} from "../utils/Time";
import ImageGallery from "./ImageGallery";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useEveryMinute } from "../utils/Hooks";
import { WEB, ANDROID } from "../utils/Constants";
import PriceText from "./PriceText";
import DaysText from "./DaysText";
import MatchableText from "./MatchableText";
import * as Interested from "../store/interested";

const windowWidth = Dimensions.get("window").width;

let columns;
let itemMargin;

if (windowWidth > 600) {
  columns = 3;
  itemMargin = 20;
} else {
  columns = 2;
  itemMargin = 15;
}

const itemWidth = (windowWidth - itemMargin * (columns + 1)) / columns;

export { columns, itemMargin, itemWidth };

const imageHeight = 80;

export default memo(
  ({ item, index, style = {}, containerStyle = {}, demo }) => {
    const dispatch = useDispatch();
    const day = useSelector(state => state.events.day);
    const notNow = useSelector(state => state.events.notNow);
    const now = useSelector(state => state.events.now);
    const [currentTime] = useEveryMinute();
    const onPress = () => {
      navigate("Detail", { id: item._id });
    };
    const placeEvents = useSelector(selectPlaceEvents(item), shallowEqual);
    const searchTerm = useSelector(state =>
      state.events.text.length
        ? state.events.text
            .split(" ")
            .map(text => text.trim())
            .filter(text => text.length)
        : state.events.tag
    );

    const hasMoreEvents = placeEvents.length > 1;

    const placeText = hasMoreEvents
      ? `${placeEvents.findIndex(e => e._id === item._id) + 1} of ${
          placeEvents.length
        }`
      : null;

    const distance = roundedDistanceTo(item);

    let time;

    if (notNow) {
      if (day) {
        time = itemTimeForDay(item, day);
      } else {
        time = itemRemainingAtTime(item, now);
      }
    } else {
      time = itemRemaining(item);
    }

    return (
      <Link
        to={`e/${item._id}`}
        containerStyle={containerStyle}
        style={[
          styles.container,
          { paddingTop: !WEB && index < columns ? itemMargin - 3 : null },
          style
        ]}
        onPress={onPress}
      >
        <View style={styles.image}>
          <ImageGallery
            photos={item._source.photos.slice(0, 4)}
            height={imageHeight}
            scrollEnabled={false}
          />
          {placeText && (
            <View style={styles.count}>
              <Text style={styles.countText}>{placeText}</Text>
            </View>
          )}
          <View style={styles.index}>
            <Text style={styles.countText}>{index + 1}</Text>
          </View>
        </View>
        <DaysText days={item._source.days} />
        <Text style={styles.titleText} allowFontScaling={false}>
          {item._source.title}
          <Text style={{ color: time.color, fontWeight: "700" }}>
            {" "}
            {time.text}
          </Text>
          <Text style={styles.subText}>{time.duration}</Text>
        </Text>
        <Text style={styles.locationText} allowFontScaling={false}>
          {item._source.location}
          <PriceText prefix=" " priceLevel={item._source.priceLevel} />
          <Text style={styles.subText}> {distance}</Text>
          {item._source.neighborhood ? (
            <Text style={styles.distanceText}>
              {" "}
              {item._source.neighborhood.split(",")[0]}
            </Text>
          ) : null}
        </Text>

        <MatchableText
          text={item._source.description}
          numberOfLines={3}
          allowFontScaling={false}
          match={searchTerm}
          style={styles.descriptionText}
        />
        {demo ? null : (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => {
                dispatch(Interested.show({ event: item }));
              }}
              style={[styles.actionButton]}
            >
              <FontAwesome
                allowFontScaling={false}
                name="star"
                size={WEB ? 16 : 15}
                color={"#FFA033"}
              />
              <Text allowFontScaling={false} style={styles.actionText}>
                Interested
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigate("Plan", { eid: item._id });
              }}
              style={[styles.actionButton, { marginLeft: 10 }]}
            >
              <Entypo
                allowFontScaling={false}
                name="calendar"
                size={WEB ? 16 : 15}
                color={RED}
              />
              <Text allowFontScaling={false} style={styles.actionText}>
                Plan
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Link>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },
  image: {
    height: imageHeight,
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4
  },
  titleText: {
    fontSize: WEB ? 16 : 17,
    color: "#000",
    fontWeight: ANDROID ? "700" : "600",
    marginVertical: WEB ? 1 : null
  },
  distanceText: {
    fontSize: 11,
    color: "#999",
    fontWeight: ANDROID ? "700" : "600"
  },
  subText: {
    fontSize: 11,
    color: "#444",
    fontWeight: ANDROID ? "700" : "600"
  },
  locationText: {
    marginBottom: WEB ? 1 : null,
    fontSize: WEB ? 14 : 15,
    color: "#000",
    fontWeight: ANDROID ? "700" : "600"
    // textTransform: "uppercase"
  },
  descriptionText: {
    marginVertical: 2,
    lineHeight: 17,
    fontSize: 13,
    color: "#444",
    fontWeight: "500"
  },
  actions: {
    flexDirection: "row"
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: WEB ? 6 : 4,
    paddingBottom: WEB ? 5 : 15
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: ANDROID ? "700" : "500",
    color: "#000"
  },
  index: {
    position: "absolute",
    top: 4,
    left: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  count: {
    position: "absolute",
    top: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  countText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700"
  }
});
