import React from "react";
import { View, Text } from "react-native";
import { IOS } from "./Constants";

export default ({
  text,
  textStyle,
  suffix = "",
  style = { flexDirection: "row", alignItems: "center" },
  characterWidth = 8.5,
  colonStyle = { paddingBottom: 2.5 }
}) => {
  const countdownText = IOS
    ? text.split("").map((char, index) => {
        const style = [{ justifyContent: "center" }];
        if (char !== ":") {
          style.push({ width: characterWidth, alignItems: "center" });
        } else {
          style.push(colonStyle);
        }
        return (
          <View key={`${char}${index}`} style={style}>
            <Text style={textStyle}>{char}</Text>
          </View>
        );
      })
    : text;
  if (IOS) {
    return (
      <View style={style}>
        {countdownText}
        <Text style={textStyle}>{suffix}</Text>
      </View>
    );
  } else {
    return (
      <Text style={textStyle}>
        {countdownText}
        {suffix}
      </Text>
    );
  }
};
