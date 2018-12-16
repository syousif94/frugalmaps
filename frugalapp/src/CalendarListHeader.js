import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import moment from "moment";

import { RED } from "./Colors";

export default class CalendarListHeader extends Component {
  static height = 36;

  state = {
    now: null
  };

  _shouldTick = () => {
    const { away, title } = this.props.section;
    return away === 0 && title !== "Closest";
  };

  componentDidMount() {
    if (this._shouldTick()) {
      this._interval = setInterval(() => {
        this.setState({
          now: moment().format("h:mm:ss a")
        });
      }, 500);
    }
  }

  componentDidUpdate() {
    if (this._shouldTick() && !this._interval) {
      this._interval = setInterval(() => {
        this.setState({
          now: moment().format("h:mm:ss a")
        });
      }, 500);
    } else if (this._interval && !this._shouldTick()) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const { section } = this.props;

    let relativeText;

    switch (section.away) {
      case 0:
        relativeText = "Today";
        break;
      case 1:
        relativeText = "Tomorrrow";
        break;
      default:
        relativeText = `${section.away} days away`;
    }

    if (section.title === "Closest") {
      const today = moment().format("dddd, MMMM Do Y");
      relativeText = `${today}`;
    } else if (this.state.now) {
      relativeText = this.state.now;
    }

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{section.title}</Text>
          <View style={styles.relative}>
            <Text style={styles.relativeText}>{relativeText}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    backgroundColor: RED,
    height: CalendarListHeader.height
  },
  info: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  },
  relative: {
    marginLeft: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  relativeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  }
});
