import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import ImageGallery from "./ImageGallery";
import { timeRemaining, makeISO, makeYesterdayISO } from "./Time";
import { WIDTH } from "./Constants";
import NotifyButton from "./NotifyButton";
import GoingButton from "./GoingButton";
import MonoText from "./MonoText";
import { FontAwesome } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";
import EventList from "./InfoEventList";

class CalendarItem extends Component {
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
    const { item } = this.props;

    emitter.emit("fit-marker", item);
  };

  _resetOnRelease = false;

  // _onPressIn = () => {
  //   const { item } = this.props;

  //   this._resetOnRelease = true;
  //   emitter.emit("fit-marker", item);
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
      title
    } = this.props;

    const containerStyle = [
      styles.container,
      { marginTop: index === 0 ? 10 : 5 }
    ];

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

    return (
      <View style={containerStyle}>
        <ImageGallery width={WIDTH - 20} doc={this.props.item} height={150} />
        <View style={styles.index} pointerEvents="none">
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <TouchableOpacity style={styles.info} onPress={this._onPress}>
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
          {title === "Closest" ? (
            <EventList time={this.state.time} placeid={item.placeid} />
          ) : (
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
              </View>
              <Text style={styles.descriptionText}>{item.description}</Text>
              {item.groupedHours.map((hours, index) => {
                return (
                  <View style={styles.hour} key={index}>
                    <View style={styles.time}>
                      <Text style={styles.hourText} numberOfLines={1}>
                        {hours.hours}{" "}
                        <Text style={styles.durationText}>
                          {hours.duration}hr
                        </Text>
                      </Text>
                    </View>
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
                  </View>
                );
              })}
              <View style={styles.actions}>
                <GoingButton event={this.props.item} />
                <NotifyButton event={this.props.item} />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default CalendarItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden"
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  index: {
    position: "absolute",
    top: 5,
    left: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  indexText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff"
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
    marginBottom: 2,
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  descriptionText: {
    marginTop: 2,
    marginBottom: 4,
    color: "#444",
    fontSize: 14,
    lineHeight: 19,
    paddingRight: 50
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7
  },
  locationInfo: { flex: 1 },
  time: {
    marginBottom: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  hour: {
    marginVertical: 3
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
  actions: { flexDirection: "row", marginBottom: 3, marginTop: 9 }
});
