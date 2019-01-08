import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageGallery from "./ImageGallery";
import { timeRemaining } from "./Time";
import { WIDTH } from "./Constants";
import NotifyButton from "./NotifyButton";
import EventList from "./InfoEventList";
import MonoText from "./MonoText";
import { FontAwesome } from "@expo/vector-icons";

class CalendarItem extends Component {
  state = {
    time: Date.now()
  };

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const {
      item: { _source: item, sort, _id: id },
      section: { data, iso, title },
      index
    } = this.props;

    const isClosest = title === "Closest";

    const containerStyle = [
      styles.container,
      { marginBottom: index + 1 === data.length ? 10 : 5 }
    ];

    let distanceText = "";

    if (sort && sort[0]) {
      distanceText = ` · ${sort[0].toFixed(1)} miles`;
    }

    const { remaining, ending, duration } = timeRemaining(
      item.groupedHours[0],
      iso
    );

    const countdownStyle = [styles.countdownText];

    let endingText = "";

    if (ending) {
      countdownStyle.push(styles.ending);
      endingText = " left";
    }

    const locationText = `${index + 1}. ${item.location}`;
    const titleText = item.title;

    const paddingVertical = isClosest ? 10 : 0;
    const marginTop = isClosest ? 0 : 10;
    const marginBottom = isClosest ? 0 : 6;

    return (
      <View style={containerStyle}>
        <View style={[styles.info, { paddingVertical }]}>
          <View style={[styles.location, { marginTop, marginBottom }]}>
            <View style={styles.locationInfo}>
              <Text numberOfLines={1} style={styles.locationText}>
                {locationText}
              </Text>
              <Text numberOfLines={1} style={styles.subText}>
                {item.city}
                {distanceText}
              </Text>
            </View>
            <View style={styles.rating}>
              <FontAwesome name="star" size={16} color="#FFA033" />
              <Text style={styles.ratingText}>
                {parseFloat(item.rating, 10).toFixed(1)}
              </Text>
            </View>
          </View>
          {!isClosest ? (
            <View style={styles.event}>
              <View>
                <View style={styles.hours}>
                  <MonoText
                    text={remaining}
                    suffix={endingText}
                    textStyle={countdownStyle}
                    characterWidth={7.5}
                    style={styles.countdown}
                  />
                  {item.groupedHours.map((hours, index) => {
                    let d;
                    if (index !== 0) {
                      const { duration } = timeRemaining(hours, iso);
                      d = duration;
                    }
                    const marginTop = index !== 0 ? 1 : 0;
                    return (
                      <View style={[styles.hour, { marginTop }]} key={index}>
                        <View style={styles.days}>
                          {hours.days.map(day => {
                            return (
                              <View style={styles.day} key={day}>
                                <Text style={styles.dayText}>{day}</Text>
                              </View>
                            );
                          })}
                        </View>
                        <View style={styles.time}>
                          <Text style={styles.hourText}>
                            {hours.hours}{" "}
                            <Text style={styles.durationText}>
                              {d ? d : duration}hr
                            </Text>
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.titleText}>{titleText}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
              <NotifyButton {...{ event: this.props.item }} key={id} />
            </View>
          ) : null}
        </View>
        <ImageGallery width={WIDTH - 20} doc={this.props.item} height={150} />
        {isClosest ? (
          <View style={styles.info}>
            <EventList placeid={item.placeid} />
          </View>
        ) : null}
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
    borderRadius: 4,
    overflow: "hidden"
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  event: {
    marginBottom: 10
  },
  titleText: {
    marginTop: 2,
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
    color: "#444",
    fontSize: 14,
    lineHeight: 19,
    maxWidth: WIDTH - 80
  },
  location: {
    flexDirection: "row",
    alignItems: "center"
  },
  locationInfo: { flex: 1 },
  time: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  hours: {
    marginTop: 2
  },
  hour: {
    flexDirection: "row",
    alignItems: "center"
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
    alignItems: "center",
    marginBottom: 2
  },
  countdownText: {
    color: "#E3210B",
    fontSize: 12,
    fontWeight: "700"
  },
  ending: {
    color: "#18AB2E"
  },
  days: {
    flexDirection: "row",
    marginRight: 3
  },
  day: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#18AB2E",
    marginRight: 2
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
  }
});
