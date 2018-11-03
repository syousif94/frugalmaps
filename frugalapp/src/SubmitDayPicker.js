import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { BLUE } from "./Colors";
import { DAYS } from "./Constants";
import * as Submission from "./store/submission";

const mapStateToProps = state => ({
  days: state.submission.days
});

const mapDispatchToProps = {
  set: Submission.actions.set
};

class DayPicker extends Component {
  _select = day => {
    const selectedIndex = this.props.days.indexOf(day);
    if (selectedIndex > -1) {
      const days = this.props.days.filter(i => i !== day);
      this.props.set({
        days
      });
    } else {
      this.props.set({
        days: [...this.props.days, day]
      });
    }
  };

  _renderCheck = day => {
    if (this.props.days.indexOf(day) > -1) {
      return <Entypo name="check" size={18} color={BLUE} />;
    }
    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        {DAYS.map((day, index) => {
          const onPress = this._select.bind(null, day);
          return (
            <TouchableOpacity onPress={onPress} style={styles.btn} key={index}>
              <Text style={styles.text}>{day}</Text>
              <View style={styles.checkBox}>{this._renderCheck(day)}</View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DayPicker);

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 2
  },
  btn: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    margin: 3,
    alignItems: "center"
  },
  text: {
    fontSize: 16,
    marginBottom: 5
  },
  checkBox: {
    backgroundColor: "#fff",
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  }
});
