import React, { PureComponent } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeArea, IOS } from "./Constants";
// import FriendFeed from "./FriendFeed";
import FriendSignup from "./FriendSignup";

export default class FriendsScreen extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <SafeArea>
          <View style={styles.title}>
            <Text style={styles.titleText}>Friend Feed</Text>
          </View>
        </SafeArea>
        <View style={styles.divider} />
        {/* <FriendFeed /> */}
        <FriendSignup />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: IOS ? 5 : 10,
    paddingBottom: 10
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
