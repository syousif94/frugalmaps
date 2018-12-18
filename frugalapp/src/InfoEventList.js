import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text } from "react-native";
import { WIDTH } from "./Constants";

import * as Events from "./store/events";
import { makeISO, timeRemaining } from "./Time";
import { BLUE } from "./Constants";
import MonoText from "./MonoText";

const mapStateToProps = (state, props) => ({
  events: Events.placeEvents(state, props)
});

const makeEvents = event => {
  const { _source: item, _id: id } = event;
  const iso = makeISO(item.days);
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

  return (
    <View style={styles.event} key={id}>
      <View style={styles.hours}>
        {item.groupedHours.map((hours, index) => {
          return (
            <View style={styles.hour} key={index}>
              <View style={styles.days}>
                {hours.days.map(day => {
                  const dayStyle = [styles.day];

                  if (day.today) {
                    styles.push(styles.today);
                  }
                  return (
                    <View style={dayStyle} key={day}>
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.time}>
                <Text style={styles.hourText}>
                  {hours.hours}{" "}
                  <Text style={styles.durationText}>{duration}hr</Text>
                </Text>
                <MonoText
                  text={remaining}
                  suffix={endingText}
                  textStyle={countdownStyle}
                />
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.boldText}>{item.title}</Text>

      <Text style={[styles.infoText, styles.descriptionText]}>
        {item.description}
      </Text>
    </View>
  );
};

class InfoEventList extends Component {
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
    const item = this.props.events[0]._source;
    return (
      <View style={styles.content}>{this.props.events.map(makeEvents)}</View>
    );
  }
}

export default connect(mapStateToProps)(InfoEventList);

const styles = StyleSheet.create({
  content: {
    // paddingHorizontal: 10,
    // paddingVertical: 5
  },
  event: {
    marginVertical: 3
  },
  boldText: {
    marginTop: 2,
    fontSize: 14,
    color: "#000",
    fontWeight: "600"
  },
  infoText: {
    marginTop: 2,
    color: "#444",
    fontSize: 14,
    lineHeight: 19
  },
  descriptionText: {
    maxWidth: WIDTH - 80
  },
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
  days: {
    flexDirection: "row",
    marginRight: 3
  },
  day: {
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#18AB2E",
    marginRight: 2
  },
  today: {
    backgroundColor: BLUE
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  },
  countdownText: {
    color: "#E3210B",
    fontSize: 14
  },
  ending: {
    color: "#18AB2E"
  }
});
