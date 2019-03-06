import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

export default class InfoHours extends Component {
  _today = moment().format("dddd");

  render() {
    return (
      <View style={styles.hours}>
        <Text style={styles.hoursTitle}>Hours</Text>
        {this.props.hours.map((hours, index) => {
          const style = [styles.hoursText];
          const day = hours.split(":")[0];
          if (this._today && this._today === day) {
            style.push(styles.today);
          }
          return (
            <Text key={index} style={style}>
              {hours.replace("���", "–")}
            </Text>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hours: {
    paddingTop: 10
  },
  hoursTitle: {
    marginTop: 3,
    fontSize: 14,
    color: "#000",
    fontWeight: "600"
  },
  hoursText: {
    fontSize: 14,
    marginTop: 2,
    color: "#666"
  },
  today: {
    color: "#000"
  }
});
