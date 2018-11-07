import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  AsyncStorage,
  Alert
} from "react-native";
import { FacebookAds, Notifications, Permissions } from "expo";
import { Entypo, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { RED } from "./Colors";
import ImageGallery from "./ImageGallery";
import { makeHours } from "./Time";
import { IOS } from "./Constants";

class CalendarItem extends Component {
  _renderAd = () => {
    const { index, section } = this.props;

    if (index === 0 && section.index === 0) {
      return (
        <View style={styles.adContainer}>
          <FacebookAds.BannerView
            style={styles.ad}
            placementId="1931177036970533_1956753154412921"
            type="standard"
            onPress={() => console.log("click")}
            onError={err => console.log("error", err)}
          />
        </View>
      );
    }

    return null;
  };

  render() {
    const {
      item: { _source: item },
      section: { iso }
    } = this.props;

    const hours = makeHours(item, iso);

    return (
      <View style={styles.container}>
        {this._renderAd()}
        <View style={styles.info}>
          <View style={styles.locationInfo}>
            <Text style={styles.timeText}>{hours}</Text>
            <Text style={styles.titleText}>{item.location}</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.descriptionText}>{hours}</Text>
            <Text style={styles.descriptionText}>{item.city}</Text>
          </View>
        </View>
        <ImageGallery doc={this.props.item} height={220} />
        <View style={styles.info}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <View style={styles.actions}>
            <Button action="notify" {...this.props} />
            <Button action="save" {...this.props} />
            <Button action="go" {...this.props} />
          </View>
        </View>
      </View>
    );
  }
}

export default CalendarItem;

class Button extends Component {
  state = {
    notify: false,
    starred: false
  };

  _onPress = async () => {
    const {
      action,
      item: { _id: id, _source: item },
      section: { iso }
    } = this.props;

    switch (action) {
      case "go":
        Linking.openURL(item.url);
        break;
      case "save":
        this.setState({
          starred: !this.state.starred
        });
        break;
      case "notify":
        try {
          const itemId = `${id}${iso}`;

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

          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );

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
        break;
      default:
        return null;
    }
  };

  componentDidMount() {
    this._areNotificationsEnabled();
  }

  _areNotificationsEnabled = async () => {
    if (this.props.action !== "notify") {
      return;
    }

    const {
      action,
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
      return <View style={styles.notificaitonsEnabled} />;
    }

    return null;
  };

  _renderIcon = () => {
    const { action } = this.props;

    switch (action) {
      case "notify":
        return (
          <View>
            <Entypo name="bell" size={18} color="#000" />
            {this._renderNotificationsEnabled()}
          </View>
        );
      case "go":
        return <MaterialIcons name="directions" size={21} color="#000" />;
      case "save":
        const { starred } = this.state;
        const color = starred ? "#F5C440" : "#000";
        return <FontAwesome name="star" size={18} color={color} />;
      default:
        return null;
    }
  };

  render() {
    const { action } = this.props;
    let text;
    switch (action) {
      case "notify":
        text = "Remind Me";
        break;
      case "go":
        text = "Directions";
        break;
      case "save":
        text = "Star";
        break;
      default:
        return null;
    }
    return (
      <TouchableOpacity style={styles.action} onPress={this._onPress}>
        {this._renderIcon()}
        <Text style={styles.actionText}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  info: {
    padding: 10
  },
  locationInfo: {
    flexDirection: "row-reverse",
    justifyContent: "space-between"
  },
  titleText: {
    fontWeight: "600",
    color: "#000"
  },
  timeText: {
    marginLeft: 3
  },
  descriptionText: {
    marginTop: 3,
    color: "#444",
    fontSize: 12
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  action: {
    paddingTop: 20,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6
  },
  actionText: {
    marginLeft: 8,
    fontWeight: "600"
  },
  notificaitonsEnabled: {
    position: "absolute",
    top: -1,
    right: -2,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: RED
  },
  adContainer: {
    height: 50,
    overflow: "hidden"
  },
  ad: {
    marginTop: IOS ? -20 : 0
  }
});
