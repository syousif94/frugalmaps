import React from "react";
import { Text } from "react-native";
import { ABBREVIATED_DAYS } from "../utils/Constants";

export default ({ days }) => {
  let text;

  const sortedDays = days.sort();

  if (days.length === 7) {
    text = "Every Day";
  } else if (sortedDays.length === 5 && sortedDays[4] === 4) {
    text = "Mon - Fri";
  } else if (
    sortedDays.length === 2 &&
    sortedDays[0] === 5 &&
    sortedDays[1] === 6
  ) {
    text = "Sat & Sun";
  } else {
    text = sortedDays.map(day => ABBREVIATED_DAYS[day]).join(", ");
  }

  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "600",
        color: "#444",
        marginTop: 2
      }}
      allowFontScaling={false}
    >
      {text}
    </Text>
  );
};
