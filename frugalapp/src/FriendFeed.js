import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";

export default class FriendFeed extends PureComponent {
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
