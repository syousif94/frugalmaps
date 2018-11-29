import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  AsyncStorage,
  Alert
} from "react-native";

import { Notifications, Permissions } from "expo";
import { Entypo } from "@expo/vector-icons";
import { RED } from "./Colors";

export default class NotifyButton extends Component {
  state = {
    notify: false,
    starred: false
  };

  _onPress = async () => {
    const {
      item: { _id: id, _source: item },
      section: { iso }
    } = this.props;

    try {
      const itemId = `${id}${iso}`;

      alert(itemId);

      const existingNotificationId = await AsyncStorage.getItem(itemId);

      if (existingNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          existingNotificationId
        );
        await AsyncStorage.removeItem(itemId);
        this.setState({
          notify: false
        });
        return;
      }

      const { status: askStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );

      if (askStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable notifications, tap Open Settings and then toggle the Notifications switch.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:");
              }
            }
          ]
        );
      }

      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status !== "granted") {
        return;
      }

      const title = `${item.title}`;
      const body = `${item.location}`;

      const notificationId = await Notifications.scheduleLocalNotificationAsync(
        {
          title,
          body,
          data: { id, iso }
        },
        { time: Date.now() + 3000, repeat: "week" }
      );

      await AsyncStorage.setItem(itemId, notificationId);
      this.setState({
        notify: true
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  componentDidMount() {
    this._areNotificationsEnabled();
  }

  _areNotificationsEnabled = async () => {
    const {
      item: { _id: id, _source: item },
      section: { iso }
    } = this.props;

    try {
      const existingNotificationId = await AsyncStorage.getItem(`${id}${iso}`);

      if (existingNotificationId) {
        this.setState({
          notify: true
        });
      }
    } catch (error) {
      this.setState({
        notify: false
      });
      Alert.alert("Error", error.message);
    }
  };

  _renderNotificationsEnabled = () => {
    if (this.props.action === "notify" && this.state.notify) {
      return <View style={styles.notificationsEnabled} />;
    }

    return null;
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
    paddingBottom: 5,
    paddingRight: 8
  },
  notificationsEnabled: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: RED
  }
});
