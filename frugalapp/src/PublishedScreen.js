import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import SearchHeader from "./SearchHeader";

export default class PublishedScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SearchHeader
          title="Published"
          placeholder="Search"
          onChangeText={() => {}}
          value={""}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
