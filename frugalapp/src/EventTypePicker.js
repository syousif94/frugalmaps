import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BLUE } from "./Colors";

export default class EventTypePicker extends Component {
  static types = ["Brunch", "Happy Hour", "Food"];

  state = {
    selected: EventTypePicker.types[1]
  };

  _select = text => {
    this.setState({
      selected: text
    });
  };

  render() {
    const { selected } = this.state;
    return (
      <View style={styles.container}>
        {EventTypePicker.types.map((text, index) => {
          const typeStyle = [styles.type];
          const textStyle = [styles.btnText];

          if (selected === text) {
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
