import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { IOS } from "../utils/Constants";

export default ({ children, style = {}, intensity = 100, tint = "light" }) => {
  if (IOS) {
    return (
      <BlurView style={style} intensity={intensity} tint={tint}>
        {children}
      </BlurView>
    );
  } else {
    return (
      <View style={[style, { backgroundColor: "rgba(255,255,255,0.95)" }]}>
        {children}
      </View>
    );
  }
};
