import React, { PureComponent } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as Going from "./store/going";
import { Ionicons } from "@expo/vector-icons";

class GoingButton extends PureComponent {
  _onPress = () => {
    this.props.set({
      selected: this.props.event
    });
  };
  render() {
    const { narrow } = this.props;
    return (
      <TouchableOpacity style={styles.btn} onPress={this._onPress}>
        <View style={styles.cal}>
          <Text style={styles.day}>Thu</Text>
          <Text style={styles.date}>14</Text>
        </View>
        <Text style={styles.btnText}>Make Plans</Text>
        <View style={styles.spacer} />
        {narrow ? null : (
          <View style={styles.icon}>
            <Ionicons
              style={styles.iconTop}
              name="ios-arrow-up"
              size={12}
              color={"#666"}
            />
            <Ionicons name="ios-arrow-down" size={12} color={"#666"} />
          </View>
        )}
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
    backgroundColor: "#efefef",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
    flex: 1,
    height: 30,
    overflow: "hidden"
  },
  btnText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 8
  },
  cal: {
    height: 30,
    alignItems: "center",
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    paddingHorizontal: 6
  },
  day: {
    fontSize: 7,
    fontWeight: "700",
    color: "#fff"
  },
  date: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff"
  },
  spacer: {
    flex: 1
  },
  icon: {
    height: 30,
    width: 16,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  iconTop: {
    marginBottom: -6
  }
});
