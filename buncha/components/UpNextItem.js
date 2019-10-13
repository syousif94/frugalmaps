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
import { itemRemaining } from "../utils/Time";
import ImageGallery from "./ImageGallery";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useEveryMinute } from "../utils/Hooks";
import { WEB } from "../utils/Constants";
import _ from "lodash";
import PriceText from "./PriceText";

const windowWidth = Dimensions.get("window").width;

let columns;
let itemMargin;

if (windowWidth > 600) {
  columns = 3;
  itemMargin = 16;
} else {
  columns = 2;
  itemMargin = 11;
}

const itemWidth = (windowWidth - itemMargin * (columns + 1)) / columns;

export { columns, itemMargin, itemWidth };

export default memo(({ item, index, style = {}, containerStyle = {} }) => {
  const [currentTime] = useEveryMinute();
  const onPress = () => {
    navigate("Detail", { id: item._id });
  };
  const placeEvents = useSelector(selectPlaceEvents(item));
  const searchTerm = useSelector(state =>
    state.events.text.length ? state.events.text : state.events.tag
  );

  const hasMoreEvents = placeEvents.length > 1;

  const placeText = hasMoreEvents
    ? `${placeEvents.findIndex(e => e._id === item._id) + 1} of ${
        placeEvents.length
      }`
    : null;

  const distance = roundedDistanceTo(item);

  const time = itemRemaining(item);

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
          photos={item._source.photos}
          height={70}
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
      <Text style={styles.locationText}>
        {item._source.location}
        <PriceText prefix=" " priceLevel={item._source.priceLevel} />
        <Text style={styles.subText}> {distance}</Text>
      </Text>
      <Text style={styles.titleText}>
        {item._source.title}
        <Text style={{ color: time.color, fontWeight: "700" }}>
          {" "}
          {time.text}
        </Text>
        <Text style={styles.subText}>{time.duration}</Text>
      </Text>
      <MatchableText
        text={item._source.description}
        numberOfLines={2}
        match={searchTerm}
        style={styles.descriptionText}
      />
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

const MatchableText = ({ match, text, ...props }) => {
  if (match) {
    const regex = new RegExp(match, "igm");
    const matchedTexts = text.replace(regex, match => {
      return `__*${match}__`;
    });
    const splitText = matchedTexts.split("__");
    return (
      <Text {...props}>
        {splitText.map((text, index) => {
          let key = `${index}${text}`;
          if (_.startsWith(text, "*")) {
            return (
              <Text
                key={key}
                style={{
                  backgroundColor: "yellow",
                  paddingHorizontal: 1,
                  borderRadius: 2,
                  marginHorizontal: -1
                }}
              >
                {text.substr(1)}
              </Text>
            );
          }
          return <Text key={key}>{text}</Text>;
        })}
      </Text>
    );
  } else {
    return <Text {...props}>{text}</Text>;
  }
};

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    marginLeft: itemMargin,
    paddingBottom: 7
  },
  image: {
    height: 70,
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4
  },
  titleText: {
    fontSize: 15,
    fontWeight: "600"
  },
  subText: { fontSize: 10, color: "#aaa", fontWeight: "700" },
  locationText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "700"
  },
  descriptionText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "#666"
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
