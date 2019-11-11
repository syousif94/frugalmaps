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
import { useSelector, shallowEqual } from "react-redux";
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
import { WEB, ABBREVIATED_DAYS } from "../utils/Constants";
import _ from "lodash";
import PriceText from "./PriceText";
import emitter from "tiny-emitter/instance";

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

const imageHeight = 95;

export default memo(({ item, index, style = {}, containerStyle = {} }) => {
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
      <DaysText days={item._source.days} />
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            emitter.emit("interested", item);
          }}
          style={[styles.actionButton]}
        >
          <FontAwesome name="star" size={16} color={"#FFA033"} />
          <Text style={styles.actionText}>Interested</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate("Plan", { eid: item._id });
          }}
          style={[styles.actionButton, { marginLeft: 10 }]}
        >
          <Entypo name="calendar" size={16} color={RED} />
          <Text style={styles.actionText}>Plan</Text>
        </TouchableOpacity>
      </View>
    </Link>
  );
});

const DaysText = ({ days }) => {
  if (days.length === 1) {
    return null;
  }

  let text;

  if (days.length === 7) {
    text = "EVERYDAY";
  } else if (days.length === 5 && days[4] === 4) {
    text = "WEEKDAYS";
  } else if (days.length === 2 && days[0] === 5 && days[1] === 6) {
    text = "WEEKENDS";
  } else {
    text = days.map(day => ABBREVIATED_DAYS[day]).join(", ");
  }

  return (
    <Text
      style={{
        fontSize: 10,
        fontWeight: "700",
        color: "#999",
        marginTop: 2
      }}
    >
      {text}
    </Text>
  );
};

const MatchableText = ({ match, text, ...props }) => {
  if (match) {
    const regexStr = Array.isArray(match) ? `(?:${match.join("|")})` : match;
    const regex = new RegExp(regexStr, "igm");
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
    marginTop: 0.5,
    lineHeight: 16.5,
    fontSize: 15,
    color: "#000",
    fontWeight: "600"
  },
  subText: {
    fontSize: 10,
    color: "#999",
    fontWeight: "700"
  },
  locationText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666"
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
    marginLeft: 6,
    fontSize: 14,
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
