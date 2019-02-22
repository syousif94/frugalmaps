import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default class GoingButton extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn}>
          <Text>Going</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flex: 1
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  }
});
