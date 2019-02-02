import React, { Component } from "react";
import { View, Animated, Text, StyleSheet } from "react-native";
import emitter from "tiny-emitter/instance";
import moment from "moment";
import { GREEN } from "./Colors";

export default class InfoHours extends Component {
  state = {
    open: false,
    height: new Animated.Value(0)
  };

  constructor(props) {
    super(props);
    this._today = moment().format("dddd");
  }

  componentDidMount() {
    emitter.on("toggle-hours", this._toggle);
  }

  componentDidUpdate(prevState) {
    if (prevState.open !== this.state.open) {
      const toValue = this.state.open ? this._height : 0;
      Animated.timing(
        this.state.height,
        { toValue, duration: 250 },
        { useNativeDriver: true }
      ).start();
    }
  }

  componentWillUnmount() {
    emitter.off("toggle-hours", this._toggle);
  }

  _toggle = () => {
    if (this._height) {
      this.setState({
        open: !this.state.open
      });
    }
  };

  _onLayout = e => {
    this._height = e.nativeEvent.layout.height;
  };

  render() {
    const style = [
      styles.container,
      {
        height: this.state.height
      }
    ];
    return (
      <Animated.View style={style}>
        <View style={styles.hours} onLayout={this._onLayout}>
          <Text style={styles.hoursTitle}>Hours</Text>
          {this.props.hours.map((hours, index) => {
            const style = [styles.hoursText];
            const day = hours.split(":")[0];
            if (this._today && this._today === day) {
              style.push(styles.today);
            }
            return (
              <Text key={index} style={style}>
                {hours}
              </Text>
            );
          })}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    zIndex: 2
  },
  hours: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 5,
    zIndex: 1
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
    color: "#444"
  },
  today: {
    color: GREEN
  }
});
