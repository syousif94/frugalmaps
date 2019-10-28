import React, { useRef } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header}>
        <Text style={styles.dateText}>Date</Text>
        <Ionicons name="ios-arrow-down" color="rgba(0,0,0,0.2)" size={16} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#f4f4f4"
  },
  header: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between"
  },
  dateText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)"
  }
});
