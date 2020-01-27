import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { BLUE } from "../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeArea } from "react-native-safe-area-context";

export default () => {
  const insets = useSafeArea();
  return (
    <View style={[styles.button, { bottom: insets.bottom + 5 }]}>
      <TouchableOpacity style={styles.touchable}>
        <Ionicons
          name="md-menu"
          size={22}
          style={{ marginTop: 3 }}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
