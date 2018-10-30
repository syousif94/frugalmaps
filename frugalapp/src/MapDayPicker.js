import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated
} from "react-native";
import { connect } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "./Colors";
import * as Events from "./store/events";

class DayPicker extends Component {
  state = {
    open: false,
    height: new Animated.Value(44),
    iconOpacity: new Animated.Value(1),
    translateDays: new Animated.Value(0)
  };

  componentWillReceiveProps(next) {
    if (!this.state.open && next.day && next.day !== this.props.day) {
      const index = next.data.findIndex(datum => {
        return datum.title === next.day;
      });

      const toValue = index * -44;

      this.setState({
        translateDays: new Animated.Value(toValue)
      });
    }
  }

  close = () => {
    if (this.state.open && this.props.day) {
      this._closePicker(this.props.day);
    }
  };

  _selectDay = day => {
    this.props.set({
      day
    });

    this._closePicker(day);
  };

  _closePicker = day => {
    const index = this.props.data.findIndex(datum => {
      return datum.title === day;
    });

    const toValue = index * -44;

    Animated.parallel([
      Animated.timing(
        this.state.iconOpacity,
        { duration: 150, toValue: 1 },
        { useNativeDriver: true }
      ),
      Animated.timing(
        this.state.height,
        { duration: 150, toValue: 44 },
        { useNativeDriver: true }
      ),
      Animated.timing(
        this.state.translateDays,
        { duration: 150, toValue },
        { useNativeDriver: true }
      )
    ]).start(() => {
      this.setState({
        open: false
      });
    });
  };

  _openPicker = () => {
    const { data } = this.props;
    if (data.length < 2) {
      return;
    }
    const height = this.props.data.length * 44;
    Animated.parallel([
      Animated.timing(
        this.state.iconOpacity,
        { duration: 150, toValue: 0 },
        { useNativeDriver: true }
      ),
      Animated.timing(
        this.state.height,
        { duration: 150, toValue: height },
        { useNativeDriver: true }
      ),
      Animated.timing(
        this.state.translateDays,
        { duration: 150, toValue: 0 },
        { useNativeDriver: true }
      )
    ]).start(() => {
      this.setState({
        open: true
      });
    });
  };

  render() {
    const { data } = this.props;
    const { open, height, iconOpacity, translateDays } = this.state;

    const constainerStyle = [
      styles.container,
      {
        height
      }
    ];

    const daysStyle = [
      {
        height: data.length * 44,
        transform: [{ translateY: translateDays }]
      }
    ];

    const iconStyle = [
      styles.icon,
      {
        opacity: iconOpacity
      }
    ];

    const iconEvents = open ? "none" : "auto";

    return (
      <Animated.View style={constainerStyle}>
        <TouchableOpacity
          style={styles.btn}
          disabled={open}
          onPress={this._openPicker}
        >
          <Animated.View style={daysStyle}>
            {data.map(day => {
              const onPress = this._selectDay.bind(null, day.title);
              const dotStyle = [styles.dot];
              if (day.title === this.props.day && open) {
                dotStyle.push(styles.selectedDay);
              }

              let relativeText;

              switch (6) {
                case 0:
                  relativeText = "Today";
                  break;
                case 1:
                  relativeText = "Tomorrrow";
                  break;
                default:
                  relativeText = `${3} days away`;
              }
              return (
                <TouchableOpacity
                  style={styles.dayBtn}
                  key={day.title}
                  disabled={!open}
                  onPress={onPress}
                >
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayText}>{day.title}</Text>
                    <View style={styles.relative}>
                      <Text style={styles.relativeText}>{relativeText}</Text>
                    </View>
                  </View>

                  <View style={dotStyle} />
                </TouchableOpacity>
              );
            })}
          </Animated.View>
          <Animated.View style={iconStyle} pointerEvents={iconEvents}>
            <Ionicons
              style={styles.iconTop}
              name="ios-arrow-up"
              size={12}
              color={"#777"}
            />
            <Ionicons name="ios-arrow-down" size={12} color={"#777"} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  day: state.events.day,
  data: state.events.data
});

const mapDispatchToProps = {
  set: Events.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(DayPicker);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 12,
    left: 12,
    width: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  btn: {
    flex: 1
  },
  dayBtn: {
    paddingBottom: 2,
    height: 44,
    flexDirection: "row",
    alignItems: "center"
  },
  dayInfo: {
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600"
  },
  relative: {
    marginLeft: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: "#6C7B80"
  },
  relativeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  dot: {
    marginRight: 13,
    marginLeft: 11,
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: BLUE,
    opacity: 0
  },
  selectedDay: {
    opacity: 1
  },
  icon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 40,
    width: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  iconTop: {
    marginBottom: -6
  }
});
