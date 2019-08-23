import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default () => {
  const error = useSelector(state => state.events.error);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Uh Oh</Text>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 35
  },
  titleText: {
    fontSize: 48,
    color: "#aaa",
    fontWeight: "700"
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#000"
  }
});
