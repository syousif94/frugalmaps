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
        style={{ marginTop: 1.5, marginLeft: 2.5 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 2,
    width: 50,
    height: buttonHeight,
    borderRadius: 3,
    backgroundColor: "rgba(180,180,180,0.1)",
    justifyContent: "center",
    alignItems: "center"
  }
});
