import React from "react";
import { Text } from "react-native";
import { ABBREVIATED_DAYS } from "../utils/Constants";

function consecutizeDays(days) {
  const consecutive = [[days[0]]];

  let i = 1;

  while (i < days.length) {
    const lastArray = consecutive[consecutive.length - 1];
    const previous = days[i - 1];
    const current = days[i];
    if (previous + 1 === current) {
      lastArray[1] = current;
    } else {
      consecutive.push([current]);
    }
    i += 1;
  }

  return consecutive.reduce((text, days, index) => {
    if (index) {
      text += ", ";
    }

    if (days.length === 1) {
      text += ABBREVIATED_DAYS[days[0]];
    } else if (days.length === 2) {
      if (days[1] - days[0] > 1) {
        text += `${ABBREVIATED_DAYS[days[0]]} - ${ABBREVIATED_DAYS[days[1]]}`;
      } else if (consecutive.length === 1) {
        text += `${ABBREVIATED_DAYS[days[0]]} & ${ABBREVIATED_DAYS[days[1]]}`;
      } else {
        text += `${ABBREVIATED_DAYS[days[0]]}, ${ABBREVIATED_DAYS[days[1]]}`;
      }
    }

    return text;
  }, "");
}

export default ({ days }) => {
  let text;

  const sortedDays = days.sort();

  if (days.length === 7) {
    text = "Every Day";
  } else {
    text = consecutizeDays(sortedDays);
  }

  return (
    <Text
      style={{
        fontSize: 10,
        fontWeight: "700",
        color: "#666"
      }}
      allowFontScaling={false}
    >
      {text}
    </Text>
  );
};
