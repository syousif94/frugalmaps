import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Input from "./Input";
import DayPicker from "./DayPicker";
import { useDispatch } from "react-redux";

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>When</Text>
      <DayPicker
        toggle={day => {
          return {
            type: "events/set",
            payload: {
              day
            }
          };
        }}
        selector={state => [state.events.day]}
      />
      <View style={styles.time}>
        <Input placeholder="Time" containerStyle={styles.inputContainer} />
        <TouchableOpacity style={styles.meridianButton}>
          <Text style={styles.buttonText}>AM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.meridianButton}>
          <Text style={styles.buttonText}>PM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  inputContainer: {
    flex: 2.2
  },
  headerText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700"
  },
  time: {
    flexDirection: "row",
    marginTop: 10
  },
  meridianButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center"
  }
});
