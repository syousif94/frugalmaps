import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MOBILE_WEB, IOS_WEB, ANDROID_WEB } from "../utils/Constants";

export default () => {
  if (!MOBILE_WEB) return null;

  const onPress = () => {
    if (IOS_WEB) {
      window.open(
        "https://itunes.apple.com/us/app/buncha-local-calendar/id1440536868?ls=1&mt=8"
      );
    } else if (ANDROID_WEB) {
      window.open(
        "https://play.google.com/store/apps/details?id=me.syousif.LitCal"
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.titleText}>Get the app</Text>
        <Text style={styles.subtext}>It's way faster</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0"
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  titleText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500"
  },
  subtext: {
    fontSize: 12,
    color: "#444",
    marginTop: 1
  }
});
