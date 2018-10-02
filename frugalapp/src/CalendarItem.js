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

export default class CalendarItem extends Component {
  render() {
    const {
      item: { _source: item },
      index,
      section
    } = this.props;
    console.log(item);
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{item.title}</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.timeText}>
              {item.start || "Open"} - {item.end || "Close"}
            </Text>
          </View>
        </View>
        <ScrollView style={styles.images} horizontal>
          {item.photos.map(uri => {
            const size = uri.split("=s")[1];
            const [width, height] = size
              .split("-h")
              .map(dimension => Number(dimension));

            const source = {
              uri,
              height,
              width
            };

            const imageWidth = (200 / height) * width;

            console.log({
              imageWidth
            });

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  images: {
    height: 200,
    backgroundColor: "#f2f2f2"
  },
  image: {
    resizeMode: "contain",
    height: 200,
    backgroundColor: "#000"
  },
  info: {
    padding: 10
  },
  locationInfo: {
    flexDirection: "row"
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
