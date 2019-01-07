import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default () => {
  return (
    <View style={styles.actions}>
      {["Call", "Web", "Hours", "Go", "Share"].map(text => {
        let icon = null;
        switch (text) {
          case "Call":
            icon = <Ionicons name="ios-call" size={18} color="#fff" />;
            break;
          case "Web":
            icon = <MaterialIcons name="web-asset" size={18} color="#fff" />;
            break;
          case "Hours":
            icon = <Ionicons name="ios-time" size={15} color="#fff" />;
            break;
          case "Go":
            icon = <MaterialIcons name="directions" size={17} color="#fff" />;
            break;
          case "Share":
            icon = <Ionicons name="ios-share-alt" size={18} color="#fff" />;
            break;
          default:
            break;
        }
        return (
          <View key={text} style={styles.action}>
            <TouchableOpacity style={styles.btn}>
              <View style={styles.icon}>{icon}</View>
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
    position: "absolute",
    bottom: 6,
    right: 0,
    left: 0,
    paddingHorizontal: 3,
    flexDirection: "row"
  },
  action: {
    marginHorizontal: 3,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4
  },
  btn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center"
  },
  icon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionText: {
    marginTop: 1,
    fontSize: 7,
    fontWeight: "500",
    color: "#e0e0e0"
  }
});
