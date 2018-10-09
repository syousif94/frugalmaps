import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { Entypo } from "@expo/vector-icons";

export default class CalendarItem extends Component {
  static imageHeight = 220;

  render() {
    const {
      item: { _source: item },
      index,
      section
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
            <Button action="share" />
            <Button action="directions" />
            <Button action="notify" />
          </View>
        </View>
      </View>
    );
  }
}

class Button extends Component {
  render() {
    const { action } = this.props;
    let icon;
    let text;
    switch (action) {
      case "notify":
        icon = <Entypo name="bell" size={18} color="#000" />;
        text = "Remind Me";
        break;
      case "share":
        icon = <Entypo name="forward" size={18} color="#000" />;
        text = "Share";
        break;
      case "directions":
        icon = <Entypo name="map" size={18} color="#000" />;
        text = "Map";
        break;
      default:
        return null;
    }
    return (
      <TouchableOpacity style={styles.action}>
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
  }
});
