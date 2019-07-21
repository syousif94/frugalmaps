import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getHistory, navigate } from "../screens";

export default ({ style }) => {
  const onPress = () => {
    const history = getHistory();
    if (history) {
      if (history.length > 2) {
        history.goBack();
      } else {
        navigate("UpNext");
      }
    }
  };
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="ios-arrow-back" color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "rgba(50,50,50,0.6)"
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 3
  }
});
