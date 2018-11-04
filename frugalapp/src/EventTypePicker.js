import React, { Component } from "react";
import { connect } from "react-redux";
import * as Submission from "./store/submission";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BLUE } from "./Colors";

const mapStateToProps = state => ({
  eventType: state.submission.eventType
});

const mapDispatchToProps = {
  set: Submission.actions.set
};

class EventTypePicker extends Component {
  static types = ["Brunch", "Happy Hour", "Food"];

  _select = text => {
    if (this.props.eventType === text) {
      this.props.set({
        eventType: null
      });
    } else {
      this.props.set({
        eventType: text
      });
    }
  };

  render() {
    const { eventType } = this.props;
    return (
      <View style={styles.container}>
        {EventTypePicker.types.map((text, index) => {
          const typeStyle = [styles.type];
          const textStyle = [styles.btnText];

          if (eventType === text) {
            typeStyle.push(styles.selected);
            textStyle.push(styles.selectedText);
          }

          if (index === 1) {
            typeStyle.push({
              flex: 1.4
            });
          }

          const onPress = this._select.bind(null, text);

          return (
            <View style={typeStyle} key={index}>
              <TouchableOpacity style={styles.btn} onPress={onPress}>
                <Text style={textStyle}>{text}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventTypePicker);

const styles = StyleSheet.create({
  container: {
    padding: 1,
    flexDirection: "row"
  },
  type: {
    flex: 1,
    margin: 4,
    height: 44,
    backgroundColor: "#ededed",
    borderRadius: 8
  },
  selected: {
    backgroundColor: BLUE
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 16
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600"
  }
});
