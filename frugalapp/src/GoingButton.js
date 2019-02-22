import React, { PureComponent } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default class GoingButton extends PureComponent {
  render() {
    return (
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Going</Text>
        <View>
          <Text style={styles.countText}>Thu</Text>
          <Text style={styles.countText}>3/2</Text>
        </View>
        <View>
          <Text style={styles.countText}>Thu</Text>
          <Text style={styles.countText}>3/2</Text>
        </View>
        <View>
          <Text style={styles.countText}>Thu</Text>
          <Text style={styles.countText}>3/2</Text>
        </View>
        <View>
          <Text style={styles.countText}>Thu</Text>
          <Text style={styles.countText}>3/2</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#fafafa",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 7
  },
  btnText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500"
  },
  countText: {
    fontSize: 7,
    fontWeight: "500",
    color: "#444",
    textAlign: "center"
  }
});
