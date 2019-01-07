import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default () => {
  return (
    <View style={styles.actions}>
      {["Call", "Web", "Hours", "Go", "Share"].map(text => {
        let icon = null;
        switch (text) {
          // case "Map":
          //   icon = (
          //     <FontAwesome
          //       style={styles.icon}
          //       name="map-marker"
          //       size={18}
          //       color="#fff"
          //     />
          //   );
          //   break;
          case "Call":
            icon = (
              <Ionicons
                style={styles.icon}
                name="ios-call"
                size={18}
                color="#fff"
              />
            );
            break;
          case "Web":
            icon = (
              <MaterialIcons
                style={styles.icon}
                name="web-asset"
                size={18}
                color="#fff"
              />
            );
            break;
          case "Hours":
            icon = (
              <Ionicons
                style={styles.icon}
                name="ios-time"
                size={15}
                color="#fff"
              />
            );
            break;
          case "Go":
            icon = (
              <MaterialIcons
                style={styles.icon}
                name="directions"
                size={17}
                color="#fff"
              />
            );
            break;
          case "Share":
            icon = (
              <Ionicons
                style={styles.icon}
                name="ios-share-alt"
                size={18}
                color="#fff"
              />
            );
            break;
          default:
            break;
        }
        return (
          <View key={text} style={styles.action}>
            {icon}
            <Text style={styles.actionText}>{text}</Text>
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
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  actionText: {
    marginTop: 1,
    fontSize: 7,
    fontWeight: "500",
    color: "#fff"
  }
});
