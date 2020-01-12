import React from "react";
import { Text } from "react-native";
import _ from "lodash";

export default ({ match, text, ...props }) => {
  if (match) {
    const regexStr = Array.isArray(match) ? `(?:${match.join("|")})` : match;
    const regex = new RegExp(regexStr, "igm");
    const matchedTexts = text.replace(regex, match => {
      return `__*${match}__`;
    });
    const splitText = matchedTexts.split("__");
    return (
      <Text {...props}>
        {splitText.map((text, index) => {
          let key = `${index}${text}`;
          if (_.startsWith(text, "*")) {
            return (
              <Text
                key={key}
                style={{
                  backgroundColor: "#DCF8FF",
                  paddingHorizontal: 1,
                  borderRadius: 2,
                  marginHorizontal: -1
                }}
              >
                {text.substr(1)}
              </Text>
            );
          }
          return <Text key={key}>{text}</Text>;
        })}
      </Text>
    );
  } else {
    return <Text {...props}>{text}</Text>;
  }
};
