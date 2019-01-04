import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { ABBREVIATED_DAYS } from "./Constants";
import { GREEN, RED } from "./Colors";
import * as Submission from "./store/submission";
import * as Submissions from "./store/submissions";
import emitter from "tiny-emitter/instance";

const mapStateToProps = state => ({
  deleteMode: state.submissions.deleteMode,
  marked: state.submissions.markedForDeletion
});

const mapDispatchToProps = {
  setSubmission: Submission.actions.set,
  setSubmissions: Submissions.actions.set
};

class SubmissionItem extends Component {
  _onPress = () => {
    if (this.props.deleteMode) {
      this.props.setSubmissions({
        markedForDeletion: this.props.item.id
      });
      return;
    }

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
    this.props.setSubmission(data);
    emitter.emit("scroll-submit", 1);
  };

  _onLongPress = () => {
    const nextDeleteMode = !this.props.deleteMode;
    if (nextDeleteMode) {
      Keyboard.dismiss();
    }
    this.props.setSubmissions({
      deleteMode: nextDeleteMode,
      markedForDeletion: this.props.item.id
    });
  };

  _renderDeleteBox = () => {
    const { item, deleteMode, marked } = this.props;

    if (!deleteMode) {
      return null;
    }

    const style = [styles.delete];

    if (marked.indexOf(item.id) !== -1) {
      style.push(styles.marked);
    } else {
      style.push(styles.unmarked);
    }

    return <View style={style} />;
  };

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
          {this._renderDeleteBox()}
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
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
  },
  delete: {
    position: "absolute",
    top: 10,
    right: 10,
    height: 16,
    width: 16,
    borderRadius: 8
  },
  unmarked: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0"
  },
  marked: {
    backgroundColor: RED
  }
});
