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
    const bgColor = { backgroundColor: "rgba(255,255,255,0.95)" };
    const styles = Array.isArray(style)
      ? [...style, bgColor]
      : [style, bgColor];
    return <View style={styles}>{children}</View>;
  }
};
