import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Text
} from "react-native";
import Emitter from "tiny-emitter";
import { db } from "./Firebase";

import { toggleEvent } from "./Notifications";

import { FontAwesome } from "@expo/vector-icons";
import { BLUE } from "./Colors";

function formatCount(count) {
  if (count > 999) {
    const scaledCount = $(count / 1000).toFixed(1);
    return `${scaledCount}k`;
  } else {
    return count;
  }
}

export default class NotifyButton extends Component {
  static emitter = new Emitter();

  state = {
    notify: false,
    count: 1
  };

  componentDidMount() {
    NotifyButton.emitter.on("toggled", this._onToggled);
    this._areNotificationsEnabled();
    this._getReminderCount();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.event._id !== this.props.event._id) {
      this._getReminderCount();
    }
  }

  componentWillUnmount() {
    NotifyButton.emitter.off("toggled", this._onToggled);
    this._unsubReminders();
  }

  _reminderSubscription;

  _getReminderCount = () => {
    this._unsubReminders();
    const {
      event: { _id: id }
    } = this.props;
    this._reminderSubscription = db
      .collection("reminders")
      .doc(id)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          this.setState({
            count: snapshot.data().count || 1
          });
        }
      });
  };

  _unsubReminders = () => {
    if (this._reminderSubscription) {
      this._reminderSubscription();
      this._reminderSubscription = null;
    }
  };

  _onToggled = id => {
    if (this.props.event._id !== id) {
      return;
    }
    this._areNotificationsEnabled();
  };

  _areNotificationsEnabled = async () => {
    const {
      event: { _id: id }
    } = this.props;

    try {
      const existingNotificationId = await AsyncStorage.getItem(`${id}`);

      if (existingNotificationId && !this.state.notify) {
        const update = {
          notify: true
        };
        this.setState(update);
      } else if (!existingNotificationId && this.state.notify) {
        const update = {
          notify: false
        };
        this.setState(update);
      }
    } catch (error) {
      if (this.state.notify) {
        const update = {
          notify: false
        };
        this.setState(update);
      }
      Alert.alert("Error", error.message);
    }
  };

  _onPress = async () => {
    const { event } = this.props;

    const notify = await toggleEvent(event);

    if (notify !== undefined) {
      const incrementBy = notify ? 1 : -1;
      let count = this.state.count + incrementBy;
      if (count < 1) {
        count = 1;
      }

      this.setState({
        count,
        notify
      });

      NotifyButton.emitter.emit("toggled", event._id);
    }
  };

  render() {
    const count = formatCount(this.state.count);
    const color = this.state.notify ? "#FFA033" : "#999";
    return (
      <TouchableOpacity
        disabled={this.state.toggling}
        style={styles.action}
        onPress={this._onPress}
      >
        <FontAwesome style={styles.icon} name="star" size={16} color={color} />
        <Text style={styles.remindText}>Interested</Text>
        <View style={styles.spacer} />
        <View style={styles.count}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: "#efefef",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    marginLeft: 5,
    flexBasis: "48%",
    minWidth: 140,
    height: 30
  },
  icon: {
    marginLeft: 5
  },
  remindText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 8
  },
  spacer: {
    flex: 1
  },
  count: {
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 3
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center"
  }
});
