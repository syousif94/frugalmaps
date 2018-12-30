import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Animated
} from "react-native";
import Emitter from "tiny-emitter";

import { toggleEvent } from "./Notifications";

import { Entypo } from "@expo/vector-icons";

const switchHeight = 10;
const ballHeight = switchHeight - 4;
const switchWidth = 18;
const ballTranslate = switchWidth - 4 - ballHeight;

export default class NotifyButton extends Component {
  static emitter = new Emitter();

  state = {
    notify: false,
    toggle: new Animated.Value(0)
  };

  componentDidMount() {
    NotifyButton.emitter.on("toggled", this._onToggled);
    this._areNotificationsEnabled();
  }

  componentDidUpdate(_, previous) {
    if (previous.notify !== this.state.notify) {
      const toValue = this.state.notify ? 1 : 0;
      Animated.timing(
        this.state.toggle,
        { duration: 100, toValue },
        { useNativeDriver: true }
      ).start();
    }
  }

  componentWillUnmount() {
    NotifyButton.emitter.off("toggled", this._onToggled);
  }

  _onToggled = id => {
    if (this.props.event._id !== id) {
      return;
    }
    this._areNotificationsEnabled();
  };

  _areNotificationsEnabled = async () => {
    const {
      event: { _id: id, _source: item }
    } = this.props;

    try {
      const existingNotificationId = await AsyncStorage.getItem(`${id}`);

      if (existingNotificationId && !this.state.notify) {
        this.setState({
          notify: true
        });
      } else if (!existingNotificationId && this.state.notify) {
        this.setState({
          notify: false
        });
      }
    } catch (error) {
      if (this.state.notify) {
        this.setState({
          notify: false
        });
      }
      Alert.alert("Error", error.message);
    }
  };

  _onPress = async () => {
    const { event } = this.props;

    const notify = await toggleEvent(event);

    if (notify !== undefined) {
      this.setState({
        notify
      });

      NotifyButton.emitter.emit("toggled", event._id);
    }
  };

  render() {
    const translateX = this.state.toggle.interpolate({
      inputRange: [0, 1],
      outputRange: [0, ballTranslate]
    });
    const transform = [{ translateX }];

    const backgroundColor = this.state.toggle.interpolate({
      inputRange: [0, 1],
      outputRange: ["#e0e0e0", "#13BE24"]
    });
    return (
      <TouchableOpacity style={styles.action} onPress={this._onPress}>
        <Entypo style={styles.icon} name="bell" size={15} color="#000" />
        <View style={styles.switch}>
          <Animated.View
            style={[styles.switchBall, { transform, backgroundColor }]}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  action: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    aspectRatio: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 8,
    paddingTop: 5
  },
  icon: {
    marginRight: 2
  },
  switch: {
    height: switchHeight,
    borderRadius: switchHeight / 2,
    width: switchWidth,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 1,
    padding: 1
  },
  switchBall: {
    height: ballHeight,
    width: ballHeight,
    borderRadius: ballHeight / 2
  }
});
