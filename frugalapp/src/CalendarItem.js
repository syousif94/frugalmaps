import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  AsyncStorage,
  Alert
} from "react-native";
import { FacebookAds, Notifications, Permissions } from "expo";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { RED } from "./Colors";

export default class CalendarItem extends Component {
  static imageHeight = 220;

  _renderAd = () => {
    const { index, section } = this.props;

    if (index === 0) {
      return (
        <View style={styles.ad}>
          <FacebookAds.BannerView
            style={{ marginTop: -20 }}
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
      item: { _source: item }
    } = this.props;

    let timeSpan;

    if (item.start && item.end) {
      timeSpan = `${item.start} - ${item.end}`;
    } else if (item.start) {
      timeSpan = `Starts at ${item.start}`;
    } else if (item.end) {
      timeSpan = `Ends at ${item.end}`;
    } else {
      timeSpan = `All Day`;
    }

    return (
      <View style={styles.container}>
        {this._renderAd()}
        <View style={styles.info}>
          <Text style={styles.titleText}>{item.title}</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.timeText}>{timeSpan}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
        <ScrollView style={styles.images} horizontal>
          {item.photos.map(photo => {
            const { url: uri, height, width } = photo;

            const source = {
              uri
            };

            const imageWidth = (CalendarItem.imageHeight / height) * width;

            return (
              <Image
                key={uri}
                source={source}
                style={[styles.image, { width: imageWidth }]}
              />
            );
          })}
        </ScrollView>
        <View style={styles.info}>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <View style={styles.actions}>
            <Button action="info" {...this.props} />
            <Button action="notify" {...this.props} />
            <Button action="go" {...this.props} />
          </View>
        </View>
      </View>
    );
  }
}

class Button extends Component {
  state = {
    notify: false
  };

  _onPress = async () => {
    const {
      action,
      item: { _id: id, _source: item },
      section: { iso }
    } = this.props;

    switch (action) {
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
      case "go":
        Linking.openURL(item.url);
        break;
      case "info":
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
      case "info":
        return <Entypo name="info-with-circle" size={18} color="#000" />;
        break;
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
      case "info":
        text = "More Info";
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
  images: {
    height: CalendarItem.imageHeight,
    backgroundColor: "#f2f2f2"
  },
  image: {
    resizeMode: "contain",
    height: CalendarItem.imageHeight,
    backgroundColor: "#e0e0e0",
    marginRight: 2
  },
  info: {
    padding: 10
  },
  locationInfo: {
    marginTop: 2,
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
    top: -4,
    right: -1,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: RED
  },
  ad: {
    height: 50,
    overflow: "hidden"
  }
});
