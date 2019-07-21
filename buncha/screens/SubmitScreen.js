import React from "react";
import { StyleSheet, View } from "react-native";
import SubmitForm from "../components/SubmitForm";

export default () => {
  return (
    <View style={styles.container}>
      <SubmitForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
