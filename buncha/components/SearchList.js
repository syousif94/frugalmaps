import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useDimensions } from "../utils/Hooks";

export default () => {
  const [dimensions] = useDimensions();
  return <View style={[styles.container, { width: dimensions.width }]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
