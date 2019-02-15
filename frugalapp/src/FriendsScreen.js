import React, { PureComponent } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default class FriendsScreen extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is your friend activity feed</Text>
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
