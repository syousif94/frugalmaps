import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { ABBREVIATED_DAYS } from "./Constants";
import { GREEN } from "./Colors";
import * as Submission from "./store/submission";

const mapDispatchToProps = {
  set: Submission.actions.set
};

class SubmissionItem extends Component {
  _onPress = () => {
    const {
      id: fid,
      days = [],
      start: startTime = "",
      end: endTime = "",
      type: eventType = "",
      ...item
    } = this.props.item;
    const data = {
      startTime,
      endTime,
      fid,
      eventType,
      days: days.map(day => parseInt(day, 10)),
      ...item
    };
    console.log({ data });
    this.props.set(data);
  };
  _onLongPress = () => {};
  render() {
    const { item, index } = this.props;
    const { start, end, type, title, description, placeid, days } = item;

    const startText = start && start.length ? start : "Open";

    const endText = end && end.length ? end : "Close";

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._onPress}
          onLongPress={this._onLongPress}
        >
          <Text style={styles.titleText}>
            {index + 1}. {title}
          </Text>
          <Text>
            {startText} - {endText}
          </Text>
          <Text>{type}</Text>
          <Text>{placeid}</Text>
          <Text>{description}</Text>
          <View style={styles.days}>
            {days.map((day, index) => {
              return (
                <View key={`${index}${day}`} style={styles.day}>
                  <Text style={styles.dayText}>{ABBREVIATED_DAYS[day]}</Text>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SubmissionItem);

const styles = StyleSheet.create({
  container: {},
  btn: {
    flex: 1,
    padding: 10
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500"
  },
  days: {
    flexDirection: "row"
  },
  day: {
    backgroundColor: GREEN,
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 3,
    marginRight: 2,
    marginTop: 2
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff"
  }
});
