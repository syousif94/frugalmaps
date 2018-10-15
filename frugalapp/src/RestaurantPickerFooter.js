import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { withNavigation } from "react-navigation";

class Footer extends Component {
  _onPressPublished = () => {
    this.props.navigation.navigate("Published");
  };

  _onPressSubmissions = () => {
    this.props.navigation.navigate("Submissions");
  };

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.length ? <View style={styles.divider} /> : null}
        <TouchableOpacity style={styles.btn} onPress={this._onPressSubmissions}>
          <Text style={styles.btnText}>Submissions</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>0</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.btn} onPress={this._onPressPublished}>
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

export default withNavigation(Footer);

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
