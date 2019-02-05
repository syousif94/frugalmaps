import React, { Component } from "react";
import { connect } from "react-redux";
import * as Submission from "./store/submission";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BLUE } from "./Colors";
import { WIDTH } from "./Constants";

const mapStateToProps = state => ({
  eventType: state.submission.eventType
});

const mapDispatchToProps = {
  set: Submission.actions.set
};

class EventTypePicker extends Component {
  static types = ["Brunch", "Happy Hour", "Food", "Game"];

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

          let emoji = "";

          switch (text) {
            case "Brunch":
              emoji = "🍑🥞";
              break;
            case "Happy Hour":
              emoji = "🍷🍻";
              break;
            case "Food":
              emoji = "🍕🌮";
              break;
            case "Game":
              emoji = "🎳🎯";
              break;
            default:
              break;
          }

          if (index % 2 === 0) {
            typeStyle.push({ marginRight: 5 });
          } else {
            typeStyle.push({ marginLeft: 5 });
          }

          if (index < 2) {
            typeStyle.push({ marginBottom: 6 });
          }

          const onPress = this._select.bind(null, text);

          return (
            <View style={typeStyle} key={index}>
              <TouchableOpacity style={styles.btn} onPress={onPress}>
                <View style={styles.emojiRow}>
                  <Text style={styles.emojiText}>{emoji}</Text>
                  {text === "Happy Hour" ? (
                    <View style={styles.twentyOne}>
                      <Text style={styles.twentyOneText}>21+</Text>
                    </View>
                  ) : null}
                </View>
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
    flexDirection: "row",
    flexWrap: "wrap"
  },
  type: {
    width: (WIDTH - 10 * 3) / 2,
    margin: 4,
    paddingVertical: 10,
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
  emojiText: {
    fontSize: 24,
    marginBottom: 4
  },
  btnText: {
    fontSize: 16
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600"
  },
  emojiRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 5
  },
  twentyOne: {
    marginLeft: 4,
    backgroundColor: "#097396",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignItems: "center"
  },
  twentyOneText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
