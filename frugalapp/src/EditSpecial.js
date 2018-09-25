import React, { Component } from "react";
import { ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-navigation";

export default class EditSpecial extends Component {
  render() {
    return (
      <ScrollView style={styles.scroll}>
        <SafeAreaView style={styles.container}>
          {this.props.children}
          <KeyboardAvoidingView behavior="padding" />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 5
  }
});
