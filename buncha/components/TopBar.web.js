import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  TimePicker,
  PlacePicker,
  buttonHeight,
  TagPicker
} from "./PickerButton";
import { navigate } from "../screens";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";

export default ({ style = {}, contentContainerStyle = {}, narrow = false }) => {
  const containerStyle = {
    backgroundColor: "rgba(240,240,240,0.9)",
    WebkitBackdropFilter: "blur(30px)",
    backdropFilter: "blur(30px)",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    borderBottom: "0.5px solid rgba(0,0,0,0.08)",
    ...StyleSheet.flatten(style)
  };

  const contentStyle = {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    alignSelf: "center",
    maxWidth: 900,
    minHeight: "100%",
    alignItems: "center",
    ...StyleSheet.flatten(contentContainerStyle)
  };

  return (
    <div style={containerStyle}>
      <View style={contentStyle}>
        <TimePicker />
        <TagPicker />
        <PlacePicker />
        <View style={{ flex: 1 }} />
        <AddButton narrow={narrow} />
      </View>
    </div>
  );
};

const AddButton = ({ narrow }) => {
  if (narrow) {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.roundBtn}
      onPress={() => {
        navigate("Add");
      }}
    >
      <Ionicons name="ios-add-circle-outline" size={18} color={BLUE} />
      <Text allowFontScaling={false} style={styles.buttonText}>
        Add Fun Stuff
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roundBtn: {
    height: buttonHeight,
    minWidth: buttonHeight,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5
  },
  buttonText: {
    marginLeft: 7,
    fontSize: 12,
    fontWeight: "500",
    color: BLUE
  }
});
