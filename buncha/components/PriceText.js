import React from "react";
import { Text } from "react-native";

const PRICE_COLORS = ["#13BE24", "#D9AA33", "#FB9F6A", "#F21D41"];

export default ({ priceLevel, style = {}, prefix = "", suffix = "" }) => {
  if (!priceLevel) {
    return null;
  }
  let signs = prefix;
  for (let i = 0; i < priceLevel; i++) {
    signs += "$";
  }
  signs += suffix;
  return (
    <Text style={[{ color: PRICE_COLORS[priceLevel - 1] }, style]}>
      {signs}
    </Text>
  );
};
