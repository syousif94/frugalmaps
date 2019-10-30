import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalendarView from "./CalendarView";

export default ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0));
  const onHeaderPress = () => {
    setExpanded(!expanded);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onHeaderPress} style={styles.header}>
        <Text style={styles.dateText}>Pick a Date</Text>
        <Animated.View
          style={{
            marginTop: 2,
            transform: [
              {
                rotate: animation.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"]
                })
              }
            ]
          }}
        >
          <Ionicons name="ios-arrow-down" color="rgba(0,0,0,0.3)" size={16} />
        </Animated.View>
      </TouchableOpacity>
      <CalendarView
        style={{ paddingHorizontal: 10 }}
        event={event}
        expanded={expanded}
        singleDay
        animatedValue={animation.current}
      />
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
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: "space-between"
  },
  dateText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)"
  }
});
