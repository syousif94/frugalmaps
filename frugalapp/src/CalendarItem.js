import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { timeRemaining, makeISO, makeYesterdayISO } from "./Time";
// import emitter from "tiny-emitter/instance";
import { WIDTH, AWSCF } from "./Constants";
import NotifyButton from "./NotifyButton";
import MonoText from "./MonoText";
import { FontAwesome } from "@expo/vector-icons";

import { withNavigation } from "react-navigation";
import * as Events from "./store/events";

const makeState = () => (state, props) => ({
  eventCount: Events.makeEventCount()(state, props)
});

class CalendarItem extends Component {
  static height = 120;
  static width = WIDTH;

  state = {
    time: Date.now()
  };

  componentDidMount() {
    this.props.emitter.on("visible", this._onVisible);
  }

  componentWillUnmount() {
    this.props.emitter.off("visible", this._onVisible);
    clearInterval(this._interval);
  }

  _onVisible = viewable => {
    const { item } = this.props;

    const inView = !!viewable.find(view => view.item === item);

    if (inView && !this._interval) {
      this._tick();
    } else if (!inView && this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  };

  _tick = () => {
    this._interval = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 6000);
  };

  _shouldTick = props => {
    const {
      section: { title }
    } = props || this.props;

    const shouldTick = title !== "Closest";

    return shouldTick;
  };

  _onPress = () => {
    const { set, navigation, item } = this.props;
    set({
      selectedEvent: {
        data: item
      }
    });
    navigation.navigate("Info");
  };

  _resetOnRelease = false;

  // _onPressIn = () => {
  //   emitter.emit("hide-sort");
  // };

  // _onPressOut = () => {
  //   if (this._resetOnRelease) {
  //     this._resetOnRelease = false;
  //     emitter.emit("reset-marker");
  //     emitter.emit("hide-callouts");
  //   }
  // };

  render() {
    const {
      item: { _source: item, sort },
      index,
      eventCount
    } = this.props;

    let iso = this.props.iso;
    let yesterdayIso;

    if (!iso) {
      iso = makeISO(item.days);
      yesterdayIso = makeYesterdayISO(item.days);
    }

    let remaining;
    let ending;
    let ended;

    const hours = item.groupedHours.find(group =>
      group.days.find(day => day.iso === iso)
    );

    const { remaining: r, ending: e, ended: ed } = timeRemaining(hours, iso);

    remaining = r;
    ending = e;
    ended = ed;

    if (yesterdayIso !== undefined && !ending) {
      const hours = item.groupedHours.find(group =>
        group.days.find(day => day.iso === yesterdayIso)
      );
      if (hours) {
        const { remaining: r, ending: e } = timeRemaining(hours, yesterdayIso);

        if (e) {
          remaining = r;
          ending = e;
        }
      }
    }

    const countdownStyle = [styles.countdownText];

    let endingText = remaining;

    if (ending) {
      countdownStyle.push(styles.ending);
      endingText = `Ends in ${endingText}`;
    } else {
      endingText = `in ${endingText}`;
      if (!ended && !ending && hours.today) {
        countdownStyle.push(styles.upcoming);
      }
    }

    const locationText = item.location;

    let cityText = item.neighborhood || item.city;

    if (sort && sort[sort.length - 1]) {
      cityText = `${sort[sort.length - 1].toFixed(1)} mi · ${cityText}`;
    }

    const images = [];
    let imagesWidth = 0;

    while (imagesWidth < CalendarItem.width - 10) {
      const index = images.length;
      const photo = item.photos[index];
      let uri = `${AWSCF}${photo.thumb.key}`;
      let imageHeight = photo.thumb.height;
      let width = photo.thumb.width;

      const source = {
        uri
      };

      const imageWidth = (150 / imageHeight) * width;
      images.push({
        source,
        width: imageWidth
      });
      imagesWidth += imageWidth;
    }

    const eventCountText = eventCount > 1 ? `+${eventCount - 1} more` : null;

    const groupedHours = item.groupedHours[0];

    const [startingHour, minutesAndMeridian] = groupedHours.hours
      .split(" ")[0]
      .split(":");

    let hour = startingHour;

    const minutes = minutesAndMeridian.substring(0, 2);

    const duration = groupedHours.duration;

    if (minutes !== "00") {
      hour = `${hour}:${minutesAndMeridian}`;
    } else {
      const meridian = minutesAndMeridian.substring(2);
      hour = `${hour}${meridian}`;
    }

    const day = `${groupedHours.days[0].text} ${hour} (${duration}hr)`;

    return (
      <TouchableOpacity style={styles.container} onPress={this._onPress}>
        <Text style={[styles.countdownText, countdownStyle]}>{endingText}</Text>
        <Text>{day}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>
            {index + 1}. {item.title}
          </Text>
          {item.type === "Happy Hour" ? (
            <View style={styles.twentyOne}>
              <Text style={styles.twentyOneText}>21+</Text>
            </View>
          ) : null}
          {eventCount > 1 ? (
            <View style={styles.eventCount}>
              <Text style={styles.countText}>{eventCountText}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.location}>
          <View style={styles.locationInfo}>
            <Text numberOfLines={1} style={styles.locationText}>
              {locationText}
            </Text>
            <Text numberOfLines={1} style={styles.subText}>
              {cityText}
            </Text>
          </View>
          <View style={styles.rating}>
            <FontAwesome name="star" size={16} color="#FFA033" />
            <Text style={styles.ratingText}>
              {parseFloat(item.rating, 10).toFixed(1)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect(
  makeState,
  {
    set: Events.actions.set
  }
)(withNavigation(CalendarItem));

const styles = StyleSheet.create({
  container: {
    width: CalendarItem.width,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 3
  },
  descriptionText: {
    marginTop: 2,
    // marginBottom: 4,
    color: "#444",
    fontSize: 14,
    lineHeight: 19
    // paddingRight: 50
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  locationInfo: { flex: 1 },
  subText: {
    color: "#444",
    fontSize: 12
  },
  countdownText: {
    color: "#E3210B", // "#EA841A",
    fontSize: 12,
    fontWeight: "700"
  },
  ending: {
    color: "#18AB2E"
  },
  upcoming: {
    color: "#E9730C"
  },
  rating: {
    flexDirection: "row"
  },
  ratingText: {
    color: "#FFA033",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5
  },
  titleRow: {
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  twentyOne: {
    marginLeft: 4,
    backgroundColor: "#097396",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignItems: "center"
  },
  twentyOneText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  },
  suffix: {
    fontSize: 12
  },
  colon: {
    paddingBottom: 1
  },
  previewWrap: {
    flex: 1,
    overflow: "hidden",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  preview: {
    height: 150,
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    overflow: "hidden"
  },
  eventCount: {
    marginLeft: 4,
    backgroundColor: "#999",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignItems: "center"
  },
  countText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
