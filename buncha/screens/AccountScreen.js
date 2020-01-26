import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import AccountView from "../components/AccountView";
import { getInset } from "../utils/SafeAreaInsets";
import { tabBarHeight } from "../components/TabBar";

export default () => {
  return (
    <View style={{ width: Dimensions.get("window").width }}>
      <AccountView
        keyboardVerticalOffset={70}
        keyboardBottomOffset={tabBarHeight + 20}
        enableDismiss
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: getInset("top")
  }
});
