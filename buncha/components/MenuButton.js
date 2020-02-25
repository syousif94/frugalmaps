import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";
import { buttonHeight } from "./PickerButton";

export default () => {
  return (
    <TouchableOpacity style={styles.btn} onPress={() => {}}>
      <Ionicons
        name="md-menu"
        size={18}
        color={BLUE}
        style={{ marginTop: 0.5, marginLeft: 1.5 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginLeft: 5,
    width: 50,
    height: buttonHeight,
    borderRadius: 5,
    backgroundColor: "rgba(180,180,180,0.1)",
    justifyContent: "center",
    alignItems: "center"
  }
});
