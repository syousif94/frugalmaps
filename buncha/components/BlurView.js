import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { IOS, WEB } from "../utils/Constants";

export default ({ children, style = {}, intensity = 100, tint = "light" }) => {
  if (IOS) {
    return (
      <BlurView style={style} intensity={intensity} tint={tint}>
        {children}
      </BlurView>
    );
  } else if (WEB) {
    const styles = {
      backgroundColor: "rgba(240,240,240,0.9)",
      WebkitBackdropFilter: "blur(30px)",
      backdropFilter: "blur(30px)",
      display: "flex",
      flexDirection: "column",
      ...StyleSheet.flatten(style)
    };
    return <div style={styles}>{children}</div>;
  } else {
    const bgColor = { backgroundColor: "rgba(255,255,255,0.95)" };
    const styles = Array.isArray(style)
      ? [...style, bgColor]
      : [style, bgColor];
    return <View style={styles}>{children}</View>;
  }
};
