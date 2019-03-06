import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as Events from "./store/events";
import * as Location from "./store/location";
import store from "./store";

class Suggestion extends Component {
  _onPress = () => {
    const { set, navigation, item, setLocation } = this.props;

    set({
      selectedEvent: {
        data: item
      }
    });

    const {
      location: { lastQuery }
    } = store.getState();

    setLocation({
      text: lastQuery
    });

    navigation.navigate("Info");
  };

  render() {
    const {
      item: { _source: item, sort, _id: id },
      index
    } = this.props;

    let cityText = item.neighborhood || item.city;

    if (sort && sort[sort.length - 1]) {
      cityText = `${sort[sort.length - 1].toFixed(1)}mi · ${cityText}`;
    }

    return (
      <TouchableOpacity style={styles.item} onPress={this._onPress}>
        <View style={styles.info}>
          <Text style={styles.name}>
            {index + 1}. {item.title}
          </Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.city}>{cityText}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {item.groupedHours.map((hours, index) => {
            const longDays = hours.days.length > 4;
            const flexDirection = longDays ? "column" : "row";
            const alignItems = longDays ? "flex-start" : "center";
            const timeMarginTop = longDays ? 1 : 0;
            return (
              <View
                style={[styles.hour, { flexDirection, alignItems }]}
                key={index}
              >
                <View style={styles.days}>
                  {hours.days.map(day => {
                    return (
                      <View style={styles.day} key={day.text}>
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
                <View style={[styles.time, { marginTop: timeMarginTop }]}>
                  <Text style={styles.hourText}>
                    {hours.hours}{" "}
                    <Text style={styles.durationText}>{hours.duration}hr</Text>
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect(
  null,
  {
    set: Events.actions.set,
    setLocation: Location.actions.set
  }
)(withNavigation(Suggestion));

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center"
  },
  info: {
    padding: 10,
    flex: 1
  },
  name: {
    fontWeight: "500"
  },
  location: {
    marginTop: 1,
    fontSize: 12,
    color: "#000",
    fontWeight: "500"
  },
  city: {
    marginTop: 1,
    fontSize: 12,
    color: "#444"
  },
  description: {
    marginTop: 2,
    color: "#444"
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
  time: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  hour: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  hourText: {
    color: "#444",
    fontSize: 14
  },
  durationText: {
    fontSize: 9
  }
});
