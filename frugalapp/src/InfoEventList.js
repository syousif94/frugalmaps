import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text } from "react-native";

import * as Events from "./store/events";
import { timeRemaining, makeISO, makeYesterdayISO } from "./Time";
import MonoText from "./MonoText";
import NotifyButton from "./NotifyButton";
import GoingButton from "./GoingButton";
import { GREEN } from "./Colors";

const mapStateToProps = (state, props) => ({
  events: Events.placeEvents(state, props)
});

const renderEvent = (event, index) => {
  const { _source: item, _id: id } = event;
  const iso = makeISO(item.days);

  let remaining;
  let ending;
  let ended;

  const { remaining: r, ending: e, ended: ed } = timeRemaining(
    item.groupedHours[0],
    iso
  );

  remaining = r;
  ending = e;
  ended = ed;

  if (!ending) {
    const yesterdayIso = makeYesterdayISO(item.days);
    if (yesterdayIso) {
      const { remaining: r, ending: e, ended: ed } = timeRemaining(
        item.groupedHours[item.groupedHours.length - 1],
        yesterdayIso
      );

      if (e) {
        remaining = r;
        ending = e;
        ended = ed;
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
  }

  const eventStyle = [styles.event];

  if (!index) {
    eventStyle.push(styles.firstEvent);
  }

  return (
    <View style={eventStyle} key={id}>
      <MonoText
        characterWidth={7.5}
        style={styles.countdown}
        text={remaining}
        suffix={endingText}
        textStyle={countdownStyle}
        suffixStyle={styles.suffix}
        colonStyle={styles.colon}
      />
      <View style={styles.titleRow}>
        <Text style={styles.boldText}>
          {index + 1}. {item.title}
        </Text>
        {item.type === "Happy Hour" ? (
          <View style={styles.twentyOne}>
            <Text style={styles.twentyOneText}>21+</Text>
          </View>
        ) : null}
      </View>
      {item.groupedHours.map((hours, index) => {
        return (
          <View style={styles.hour} key={index}>
            <View style={styles.time}>
              <Text style={styles.hourText} numberOfLines={1}>
                {hours.hours}{" "}
                <Text style={styles.durationText}>{hours.duration}hr</Text>
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
                        <Text style={styles.dayText}>{day.daysAway}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
      <Text style={[styles.infoText, styles.descriptionText]}>
        {item.description}
      </Text>
      <View style={styles.actions}>
        <GoingButton event={event} />
        <View style={styles.actionsDivider} />
        <NotifyButton event={event} />
      </View>
    </View>
  );
};

class InfoEventList extends Component {
  state = {
    time: Date.now()
  };

  componentDidMount() {
    if (this.props.tick) {
      this._startTick();
    }
  }

  componentWillReceiveProps(next) {
    if (this.props.tick !== next.tick) {
      if (next.tick && !this._interval) {
        this._startTick();
      } else if (!next.tick && this._interval) {
        this._stopTick();
      }
    }
  }

  _startTick = () => {
    this._interval = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 500);
  };

  _stopTick = () => {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  };

  componentWillUnmount() {
    this._stopTick();
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
    marginVertical: 6
  },
  firstEvent: {
    marginTop: 3
  },
  boldText: {
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
    paddingRight: 50
  },
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
    alignItems: "flex-end",
    marginBottom: 2
  },
  countdownText: {
    color: "#E3210B",
    fontSize: 12,
    fontWeight: "700"
  },
  ending: {
    color: GREEN
  },
  ended: {
    backgroundColor: "#EA841A"
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
    fontSize: 9
  },
  colon: {
    paddingBottom: 1
  },
  actions: { flexDirection: "row", marginBottom: 5, marginTop: 7 },
  actionsDivider: { width: 10 }
});
