import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { IOS, WEB } from "../utils/Constants";

function makeTint(tint) {
  switch (tint) {
    case "dark":
      return "rgba(0,0,0,0.9)";
    default:
      return "rgba(240,240,240,0.9)";
  }
}

export default ({ children, style = {}, intensity = 100, tint = "light" }) => {
  if (IOS) {
    return (
      <BlurView style={style} intensity={intensity} tint={tint}>
        {children}
      </BlurView>
    );
  } else if (WEB) {
    const styles = {
      backgroundColor: makeTint(tint),
      WebkitBackdropFilter: "blur(30px)",
      backdropFilter: "blur(30px)",
      display: "flex",
      flexDirection: "column",
      ...StyleSheet.flatten(style)
    };
    return <div style={styles}>{children}</div>;
  } else {
    const bgColor = { backgroundColor: makeTint(tint) };
    const styles = Array.isArray(style)
      ? [...style, bgColor]
      : [style, bgColor];
    return <View style={styles}>{children}</View>;
  }
};
