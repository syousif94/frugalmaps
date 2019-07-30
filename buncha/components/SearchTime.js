import React from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import SubmissionInput from "./SubmissionInput";

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>When</Text>
      <TouchableOpacity style={styles.meridianButton} />
      <TextInput style={styles.input} placeholder="Time" />
      <TouchableOpacity style={styles.meridianButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10
  },
  headerText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
    marginLeft: 10
  }
});
