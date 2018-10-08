import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

class EventTypePicker extends Component {
  static types = ["Happy Hour", "Brunch", "Daily Special"];

  render() {
    return (
      <View style={styles.container}>
        {EventTypePicker.types.map((text, index) => {
          return (
            <View style={styles.type} key={index}>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>{text}</Text>
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
    padding: 2
  }
});
