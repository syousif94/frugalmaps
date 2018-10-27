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
import { FacebookAds, Notifications } from "expo";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

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
            <Button action="directions" {...this.props} />
            <Button action="notify" {...this.props} />
            <Button action="go" {...this.props} />
          </View>
        </View>
      </View>
    );
  }
}

class Button extends Component {
  _onPress = async () => {
    const {
      action,
      item: { _id: id, _source: item },
      section: { iso }
    } = this.props;
    switch (action) {
      case "notify":
        try {
          const existingNotificationId = await AsyncStorage.getItem(
            `${id}${iso}`
          );

          if (existingNotificationId) {
            await Notifications.cancelScheduledNotificationAsync(
              existingNotificationId
            );
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
            { time: Date.now() + 5000, repeat: "week" }
          );

          await AsyncStorage.setItem(`${id}${iso}`, notificationId);
        } catch (error) {
          Alert.alert("Error", error.message);
        }
        break;
      case "go":
        Linking.openURL(item.url);
        break;
      case "directions":
        break;
      default:
        return null;
    }
  };

  render() {
    const { action } = this.props;
    let icon;
    let text;
    switch (action) {
      case "notify":
        icon = <Entypo name="bell" size={18} color="#000" />;
        text = "Remind Me";
        break;
      case "go":
        icon = <MaterialIcons name="directions" size={20} color="#000" />;
        text = "Directions";
        break;
      case "directions":
        icon = <Entypo name="map" size={18} color="#000" />;
        text = "Map";
        break;
      default:
        return null;
    }
    return (
      <TouchableOpacity style={styles.action} onPress={this._onPress}>
        {icon}
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
    marginLeft: 13,
    fontWeight: "600"
  },
  ad: {
    height: 50,
    overflow: "hidden"
  }
});
