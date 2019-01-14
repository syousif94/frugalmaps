import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { WIDTH } from "./Constants";

const iconColor = "#000";

export default () => {
  return (
    <View style={styles.actions}>
      {["Call", "Web", "Hours", "Go", "Share"].map(text => {
        let icon = null;
        let emoji = "";
        switch (text) {
          case "Call":
            icon = <Ionicons name="ios-call" size={24} color={iconColor} />;
            emoji = "📞";
            break;
          case "Web":
            icon = (
              <MaterialIcons name="web-asset" size={24} color={iconColor} />
            );
            emoji = "🔗";
            break;
          case "Hours":
            icon = <Ionicons name="ios-time" size={21} color={iconColor} />;
            emoji = "🕘";
            break;
          case "Go":
            icon = (
              <MaterialIcons name="directions" size={23} color={iconColor} />
            );
            emoji = "🚕";
            break;
          case "Share":
            icon = (
              <Ionicons name="ios-share-alt" size={24} color={iconColor} />
            );
            emoji = "📫";
            break;
          default:
            break;
        }
        return (
          <View key={text} style={styles.action}>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.icon}>{emoji}</Text>
              <Text style={styles.actionText}>{text}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 10
  },
  action: {
    width: (WIDTH - 30) / 5 - 8,
    backgroundColor: "#ededed",
    borderRadius: 5
  },
  btn: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: "center"
  },
  icon: {
    fontSize: 18
  },
  actionText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "500",
    color: "#000"
  }
});
