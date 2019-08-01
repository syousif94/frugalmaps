import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import SubmitTags from "./SubmitTags";

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>What</Text>
      <SubmitTags />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  headerText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
    marginBottom: 5
  }
});
