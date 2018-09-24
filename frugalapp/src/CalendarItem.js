import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
    const { item, index, section } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{item.title}</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.timeText}>
              {item.start} - {item.end}
            </Text>
          </View>
        </View>
        <View style={styles.images} />
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
