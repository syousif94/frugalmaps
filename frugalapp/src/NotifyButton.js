import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import Emitter from "tiny-emitter";

import { toggleEvent } from "./Notifications";

import { Entypo } from "@expo/vector-icons";
import { RED } from "./Colors";

export default class NotifyButton extends Component {
  static emitter = new Emitter();

  state = {
    notify: false
  };

  componentDidMount() {
    NotifyButton.emitter.on("toggled", this._onToggled);
    this._areNotificationsEnabled();
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

  _renderNotificationsEnabled = () => {
    if (this.state.notify) {
      return <View style={styles.notificationsEnabled} />;
    }

    return null;
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
    return (
      <TouchableOpacity style={styles.action} onPress={this._onPress}>
        <View>
          <Entypo name="bell" size={16} color="#000" />
          {this._renderNotificationsEnabled()}
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
    paddingBottom: 2,
    paddingRight: 8
  },
  notificationsEnabled: {
    position: "absolute",
    top: -3,
    right: -2,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: RED
  }
});
