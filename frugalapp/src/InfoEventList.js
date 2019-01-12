import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text } from "react-native";
import { WIDTH } from "./Constants";

import * as Events from "./store/events";
import { makeISO, timeRemaining } from "./Time";
import MonoText from "./MonoText";
import NotifyButton from "./NotifyButton";
import { GREEN } from "./Colors";

const mapStateToProps = (state, props) => ({
  events: Events.placeEvents(state, props)
});

const renderEvent = event => {
  const { _source: item, _id: id } = event;
  const iso = makeISO(item.days);
  const { remaining, ending, duration } = timeRemaining(
    item.groupedHours[0],
    iso
  );

  const countdownStyle = [styles.countdownText];

  let endingText = " minutes";

  if (remaining.length > 9) {
    endingText = " days";
  } else if (remaining.length > 6) {
    endingText = " hours";
  }

  if (ending) {
    countdownStyle.push(styles.ending);
    endingText += " left";
  }

  return (
    <View style={styles.event} key={id}>
      <View style={styles.hours}>
        <MonoText
          characterWidth={7.5}
          style={styles.countdown}
          text={remaining}
          suffix={endingText}
          textStyle={countdownStyle}
        />
        {item.groupedHours.map((hours, index) => {
          let d;
          if (index !== 0) {
            const { duration } = timeRemaining(hours, iso);
            d = duration;
          }
          const marginTop = index !== 0 ? 1 : 0;
          const flexDirection = hours.days.length > 4 ? "column" : "row";
          const alignItems = hours.days.length > 4 ? "flex-start" : "center";
          return (
            <View
              style={[styles.hour, { marginTop, flexDirection, alignItems }]}
              key={index}
            >
              <View style={styles.days}>
                {hours.days.map(day => {
                  const dayStyle = [styles.day];
                  return (
                    <View style={dayStyle} key={day.text}>
                      <Text style={styles.dayText}>{day.text}</Text>
                      {day.daysAway === 0 ? null : (
                        <View style={styles.daysAway}>
                          <Text style={styles.dayText}>{day.daysAway}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              <View style={styles.time}>
                <Text style={styles.hourText}>
                  {hours.hours}{" "}
                  <Text style={styles.durationText}>{d ? d : duration}hr</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View>
        <Text style={styles.boldText}>{item.title}</Text>

        <Text style={[styles.infoText, styles.descriptionText]}>
          {item.description}
        </Text>
      </View>
      <NotifyButton {...{ event }} />
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
    return (
      <View style={styles.content}>{this.props.events.map(renderEvent)}</View>
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
    alignItems: "center"
    // justifyContent: "space-between"
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
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#18AB2E",
    alignItems: "center",
    marginRight: 2
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
    color: GREEN
  }
});
