import React, { PureComponent } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as Going from "./store/going";

class GoingButton extends PureComponent {
  _onPress = () => {
    this.props.set({
      selected: this.props.event
    });
  };
  render() {
    return (
      <TouchableOpacity style={styles.btn} onPress={this._onPress}>
        <Text style={styles.btnText}>Make Plans</Text>
      </TouchableOpacity>
    );
  }
}

const mapDispatch = {
  set: Going.actions.set
};

export default connect(
  null,
  mapDispatch
)(GoingButton);

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
