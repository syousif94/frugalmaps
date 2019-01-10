import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as Submissions from "./store/submissions";

import emitter from "tiny-emitter/instance";

const mapStateToProps = state => ({
  count: Submissions.submissionsCount(state)
});

class SubmissionsButton extends Component {
  componentDidMount() {
    emitter.on("push-submissions", this._onPress);
  }

  componentWillUnmount() {
    emitter.off("push-submissions", this._onPress);
  }

  _onPress = () => {
    this.props.navigation.navigate("Submissions");
  };

  render() {
    const { count } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Text style={styles.btnText}>Submissions</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(connect(mapStateToProps)(SubmissionsButton));

const styles = StyleSheet.create({
  container: {
    height: 26,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  btn: {
    paddingLeft: 8,
    paddingRight: 4,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row"
  },
  btnText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff"
  },
  count: {
    marginLeft: 8,
    height: 18,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
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
