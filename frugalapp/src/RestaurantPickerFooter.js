import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

export default class Footer extends Component {
  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.length ? <View style={styles.divider} /> : null}
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Submissions</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>0</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Published</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>0</Text>
          </View>
        </TouchableOpacity>
        {!data.length ? <View style={styles.divider} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    padding: 10
  },
  btnText: {
    fontWeight: "500"
  },
  count: {
    height: 18,
    borderRadius: 9,
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "transparent"
  }
});
