import React, { Component } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-navigation";

export default class LocationBox extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.search}>
          <Entypo name="magnifying-glass" size={18} color="#000" />
          <TextInput
            placeholder="Newport Beach, California"
            style={styles.input}
            placeholderTextColor="#333"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  search: {
    margin: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingHorizontal: 10,
    flex: 1
  }
});
