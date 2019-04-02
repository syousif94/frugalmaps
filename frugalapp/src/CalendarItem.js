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
  static height = 266;
  static width = WIDTH - 50;

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
    }, 500);
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

    let endingText = " minutes";

    if (!remaining) {
    } else if (remaining.length > 9) {
      endingText = " days";
    } else if (remaining.length > 6) {
      endingText = " hours";
    }

    if (ending) {
      countdownStyle.push(styles.ending);
      endingText += " left";
    } else {
      endingText += " away";
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

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.marker} pointerEvents="none" />
          <TouchableOpacity
            style={styles.info}
            onPress={this._onPress}
            // delayPressIn={0}
            // onPressIn={this._onPressIn}
          >
            <View style={styles.hours}>
              {item.groupedHours.map((hours, index) => {
                return (
                  <View style={styles.hour} key={index}>
                    <View style={styles.days}>
                      {hours.days.map(day => {
                        const dayStyle = [styles.day];
                        if (day.daysAway === 0 && ended) {
                          dayStyle.push(styles.ended);
                        }
                        return (
                          <View style={dayStyle} key={day.text}>
                            <Text style={styles.dayText}>{day.text}</Text>
                            {day.daysAway === 0 ? null : (
                              <View style={styles.daysAway}>
                                <Text style={styles.dayText}>
                                  {day.daysAway}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                    <View style={styles.time}>
                      <Text style={styles.hourText} numberOfLines={1}>
                        {hours.hours}{" "}
                        <Text style={styles.durationText}>
                          {hours.duration}hr
                        </Text>
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.location}>
              <View style={styles.locationInfo}>
                <Text numberOfLines={1} style={styles.locationText}>
                  {index + 1}. {locationText}
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
            <View style={styles.event}>
              <MonoText
                text={remaining}
                suffix={endingText}
                textStyle={countdownStyle}
                characterWidth={7.5}
                style={styles.countdown}
                suffixStyle={styles.suffix}
                colonStyle={styles.colon}
              />
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>{item.title}</Text>
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
            </View>
          </TouchableOpacity>
          <View style={styles.previewWrap}>
            <View style={styles.preview}>
              {images.map(image => {
                const imageStyle = {
                  height: 150,
                  width: image.width,
                  marginRight: 2
                };
                return (
                  <Image
                    source={image.source}
                    style={imageStyle}
                    key={image.source.uri}
                  />
                );
              })}
              <View style={styles.actions}>
                {/* <GoingButton event={this.props.item} /> */}
                <NotifyButton card event={this.props.item} />
              </View>
            </View>
          </View>
        </View>
      </View>
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
    height: CalendarItem.height,
    width: CalendarItem.width
  },
  content: {
    height: CalendarItem.height - 24,
    backgroundColor: "#fff",
    width: CalendarItem.width - 10,
    marginHorizontal: 5,
    marginTop: 7,
    borderRadius: 8,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    overflow: "hidden"
  },
  marker: {
    position: "absolute",
    top: 5,
    width: 20,
    left: (WIDTH - 60) / 2 - 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  event: {
    // paddingHorizontal: 15,
    // paddingBottom: 10
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
    marginBottom: 5
  },
  locationInfo: { flex: 1 },
  time: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  hours: {
    flexDirection: "row",
    marginTop: 2,
    marginBottom: 3
  },
  hour: {
    marginRight: 10
  },
  hourText: {
    color: "#444",
    fontSize: 14
  },
  durationText: {
    fontSize: 9
  },
  subText: {
    color: "#444",
    fontSize: 12
  },
  countdown: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 2
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
  days: {
    flexDirection: "row"
  },
  day: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#18AB2E",
    alignItems: "center",
    marginRight: 2
  },
  ended: {
    backgroundColor: "#999"
  },
  daysAway: {
    marginLeft: 2,
    marginRight: -1,
    paddingHorizontal: 2,
    borderRadius: 2.5,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
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
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    top: 5,
    left: 0,
    right: 0
  }
});
