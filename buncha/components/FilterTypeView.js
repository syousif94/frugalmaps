import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { PAGE } from "../store/filters";

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{PAGE.TYPE}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleText: {
    marginTop: 12,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
    fontWeight: "700"
  }
});
