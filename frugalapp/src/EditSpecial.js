import React, { Component } from "react";
import { ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-navigation";

export default class EditSpecial extends Component {
  render() {
    return (
      <KeyboardAvoidingView style={styles.scroll} behavior="padding">
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <SafeAreaView style={styles.container}>
            {this.props.children}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
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
