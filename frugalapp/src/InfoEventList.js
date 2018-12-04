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
    const item = this.props.events[0]._source;
    return (
      <View>
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.infoText}>{item.city}</Text>
        <ScrollView horizontal contentContainerStyle={styles.content}>
          {this.props.events.map(event => {
            const { _source: item, _id: id } = event;
            const iso = makeISO(item.days);
            const { remaining, ending } = timeRemaining(
              item.groupedHours[0],
              iso
            );

            const countdownStyle = [styles.countdownText];

            if (ending) {
              countdownStyle.push(styles.ending);
            }
            return (
              <View style={styles.event} key={id}>
                <Text style={styles.boldText}>{item.title}</Text>
                <View style={styles.hours}>
                  {item.groupedHours.map((hours, index) => {
                    return (
                      <View style={styles.hour} key={index}>
                        <Text style={styles.hourText}>{hours.hours}</Text>
                        <View style={styles.days}>
                          {hours.days.map(day => {
                            return (
                              <View style={styles.day} key={day}>
                                <Text style={styles.dayText}>{day}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}
                </View>
                <Text style={countdownStyle}>{remaining}</Text>
                <Text style={styles.infoText}>{item.description}</Text>
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
    paddingRight: 15,
    paddingLeft: 50
  },
  event: {
    marginHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
    maxWidth: WIDTH / 1.5
  },
  boldText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600"
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  infoText: {
    marginTop: 3,
    color: "#444",
    fontSize: 12
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
    fontSize: 12
  },
  days: {
    flexDirection: "row",
    marginLeft: 3
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
    color: "#E3210B",
    fontSize: 12
  },
  ending: {
    color: "#18AB2E"
  }
});
