import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { ABBREVIATED_DAYS } from "./Constants";
import { GREEN } from "./Colors";
import { connect } from "react-redux";
import * as Submission from "./store/submission";
import emitter from "tiny-emitter/instance";
import { formatTime } from "./Time";

const mapDispatchToProps = {
  setSubmission: Submission.actions.set
};

class PublishedItem extends Component {
  _onPress = () => {
    const {
      item: { _id: id, _source: item }
    } = this.props;

    const {
      days = [],
      start,
      end,
      type: eventType = "",
      placeid,
      description,
      title
    } = item;

    const startTime = start && start.length ? formatTime(start) : "";

    const endTime = end && end.length ? formatTime(end) : "";

    const data = {
      title,
      startTime,
      endTime,
      id,
      fid: null,
      eventType,
      days,
      placeid,
      description
    };

    this.props.setSubmission(data);
    emitter.emit("scroll-submit", 1);
  };

  render() {
    const {
      item: { _source: item },
      index
    } = this.props;

    const { start, end } = item;

    const startText = start && start.length ? formatTime(start) : "Open";

    const endText = end && end.length ? formatTime(end) : "Close";
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Text style={styles.titleText}>
            {index + 1}. {item.location}
          </Text>
          <Text style={styles.subtext}>{item.city}</Text>
          <View style={styles.days}>
            {item.days.map((day, index) => {
              return (
                <View key={`${index}${day}`} style={styles.day}>
                  <Text style={styles.dayText}>{ABBREVIATED_DAYS[day]}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.subtext}>
            {startText} - {endText}
          </Text>
          <Text style={styles.subtext}>{item.description}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(PublishedItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: 44
  },
  btn: {
    flex: 1,
    padding: 10
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500"
  },
  subtext: {
    fontSize: 12,
    color: "#444"
  },
  days: {
    flexDirection: "row",
    marginVertical: 2
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
