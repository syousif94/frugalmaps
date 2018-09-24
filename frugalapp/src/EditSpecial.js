import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { SafeAreaView } from "react-navigation";

export default class EditSpecial extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Title"
          style={[styles.input, styles.title]}
          placeholderTextColor="#333"
        />
        <TextInput
          placeholder="Description"
          style={[styles.input, styles.description]}
          multiline
          placeholderTextColor="#333"
          blurOnSubmit
        />
        <View style={styles.row}>
          <TextInput
            placeholder="Start Time"
            style={[styles.input, styles.time]}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="End Time"
            style={[styles.input, styles.time]}
            placeholderTextColor="#333"
          />
        </View>
        <KeyboardAvoidingView behavior="padding" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 5,
    justifyContent: "flex-end"
  },
  input: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    margin: 5
  },
  title: {
    height: 44
  },
  description: {
    height: 200,
    paddingTop: 8
  },
  row: {
    flexDirection: "row"
  },
  time: {
    height: 44,
    flex: 1
  }
});
