import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Animated,
  Text
} from "react-native";
import Emitter from "tiny-emitter";
import { db } from "./Firebase";

import { toggleEvent } from "./Notifications";

import { Entypo } from "@expo/vector-icons";

const switchHeight = 10;
const ballHeight = switchHeight - 4;
const switchWidth = 18;
const ballTranslate = switchWidth - 4 - ballHeight;

function formatCount(count) {
  if (count < 10) {
    return `00${count}`;
  } else if (count < 100) {
    return `0${count}`;
  } else if (count > 999) {
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
    toggle: new Animated.Value(0),
    count: 1,
    toggling: false
  };

  componentDidMount() {
    NotifyButton.emitter.on("toggled", this._onToggled);
    this._areNotificationsEnabled(true);
    this._getReminderCount();
  }

  componentDidUpdate(prevProps, prevState) {
    const shouldToggle = prevState.notify !== this.state.notify;
    if (shouldToggle) {
      const toValue = this.state.notify ? 1 : 0;
      if (prevState.toggling) {
        Animated.timing(
          this.state.toggle,
          { duration: 100, toValue },
          { useNativeDriver: true }
        ).start();
      } else {
        this.state.toggle.setValue(toValue);
      }
    }
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

  _areNotificationsEnabled = async init => {
    const {
      event: { _id: id, _source: item }
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
    await new Promise(resolve => {
      this.setState(
        {
          toggling: true
        },
        resolve
      );
    });

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
        notify,
        toggling: false
      });

      NotifyButton.emitter.emit("toggled", event._id);
    } else {
      this.setState({
        toggling: false
      });
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
      outputRange: ["#ccc", "#13BE24"]
    });

    const count = formatCount(this.state.count);
    return (
      <TouchableOpacity
        disabled={this.state.toggling}
        style={styles.action}
        onPress={this._onPress}
      >
        <Entypo style={styles.icon} name="bell" size={16} color="#000" />
        <Text style={styles.remindText}>Remind Me</Text>
        <View style={{ flex: 1 }} />
        <View>
          <Text style={styles.countText}>{count}</Text>
          <View style={styles.switch}>
            <Animated.View
              style={[styles.switchBall, { transform, backgroundColor }]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: "#fafafa",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginLeft: 5,
    flexBasis: "48%",
    minWidth: 140
  },
  icon: { marginTop: 1, marginLeft: 3 },
  switch: {
    height: switchHeight,
    borderRadius: switchHeight / 2,
    width: switchWidth,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 1,
    padding: 1,
    backgroundColor: "#fff"
  },
  switchBall: {
    height: ballHeight,
    width: ballHeight,
    borderRadius: ballHeight / 2
  },
  remindText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 7
  },
  countText: {
    fontSize: 7,
    fontWeight: "500",
    color: "#444",
    textAlign: "center"
  }
});
