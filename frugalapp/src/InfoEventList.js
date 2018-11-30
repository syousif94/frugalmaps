import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { WIDTH } from "./Constants";

import * as Events from "./store/events";
import { makeISO, timeRemaining } from "./Time";

const mapStateToProps = (state, props) => ({
  events: Events.placeEvents(state, props)
});

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
      <View>
        <ScrollView horizontal contentContainerStyle={styles.content}>
          {this.props.events.map(event => {
            const { _source: item, _id: id } = event;
            const iso = makeISO(item.days);
            return (
              <View style={styles.event} key={id}>
                <Text style={styles.boldText}>{item.title}</Text>
                <Text style={styles.infoText}>{item.description}</Text>
                <View style={styles.hours}>
                  {item.groupedHours.map((hours, index) => {
                    const { remaining, ending } = timeRemaining(hours, iso);

                    const countdownStyle = [styles.countdownText];

                    if (ending) {
                      countdownStyle.push(styles.ending);
                    }
                    return (
                      <View style={styles.hour} key={index}>
                        <View style={styles.days}>
                          {hours.days.map(day => {
                            return (
                              <View style={styles.day} key={day}>
                                <Text style={styles.dayText}>{day}</Text>
                              </View>
                            );
                          })}
                        </View>
                        <Text style={styles.hourText}>{hours.hours}</Text>
                        <Text style={countdownStyle}>{remaining}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps)(InfoEventList);

const styles = StyleSheet.create({
  content: {
    paddingRight: 10,
    paddingLeft: 50
  },
  event: {
    marginHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    maxWidth: WIDTH / 1.5
  },
  boldText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  },
  infoText: {
    marginTop: 3,
    color: "#e0e0e0",
    fontSize: 12
  },
  hours: {
    marginTop: 10
  },
  hour: {
    flexDirection: "row",
    alignItems: "center"
  },
  hourText: {
    color: "#e0e0e0",
    fontSize: 12
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
  countdownText: {
    marginLeft: 4,
    color: "#E3210B",
    fontSize: 12
  },
  ending: {
    color: "#18AB2E"
  }
});
