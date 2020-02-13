import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { navigate } from "../screens";
import { BLUE, RED } from "../utils/Colors";
import { FontAwesome, EvilIcons, Feather } from "@expo/vector-icons";
import BlurView from "./BlurView";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ANDROID } from "../utils/Constants";
import TagList, { TAG_LIST_HEIGHT } from "./TagList";
import { getInset } from "../utils/SafeAreaInsets";

let bottomInset = getInset("bottom");
if (bottomInset < 20) {
  bottomInset += 5;
}
const topPadding = 5;
const topBorderWidth = 1;
// const buttonHeight = 44;

const tabBarHeight = TAG_LIST_HEIGHT + topBorderWidth + bottomInset;

export { tabBarHeight };

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  const iC = iconColor(routeKey);

  return (
    <BlurView style={styles.container}>
      <View style={styles.content}>
        <TagList contentContainerStyle={{ padding: 2.5 }} />
      </View>
    </BlurView>
  );
};

function iconColor(routeKey) {
  return function(routeName) {
    return routeName === routeKey ? BLUE : "#777";
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: tabBarHeight
  },
  content: {
    flex: 1,
    borderTopWidth: topBorderWidth,
    borderColor: "rgba(0,0,0,0.05)"
  }
});
