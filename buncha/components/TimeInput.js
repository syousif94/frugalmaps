import React from "react";
import Input from "./Input";
import { View, Text, StyleSheet } from "react-native";
import { detruncateTime, validateTime } from "../utils/Time";
import { RED } from "../utils/Colors";
import { WEB, IOS } from "../utils/Constants";

export default React.forwardRef(
  (
    {
      value,
      validated,
      onChangeText,
      placeholder,
      containerStyle = {},
      name,
      ...props
    },
    ref
  ) => {
    let valid = true;
    let expandedTime = null;
    if (validated) {
      expandedTime = validated.expanded;
      valid = validated.inRange;
    } else if (value.trim().length) {
      expandedTime = detruncateTime(value);
      valid = validateTime(expandedTime);
      if (
        valid &&
        expandedTime &&
        !value.match(":") &&
        value.match(/(a|p)/gi)
      ) {
        expandedTime = value.match("m") ? null : `${value}m`;
      }
    }
    return (
      <View style={containerStyle}>
        <View>
          <TimeInput
            value={value}
            onChangeText={onChangeText}
            name={name}
            ref={ref}
            invalid={!valid}
            {...props}
          />
          <TimeOverlay
            placeholder={placeholder}
            actual={value}
            value={expandedTime}
            valid={validated ? validated.valid : valid}
          />
        </View>
        <TimeInvalid valid={valid} range={validated && validated.range} />
      </View>
    );
  }
);

const TimeInvalid = ({ valid, range }) => {
  return (
    <View style={styles.invalid}>
      {range ? (
        <Text style={styles.invalidText}>
          <Text style={{ color: "#555" }}>{range}</Text>
          {valid ? null : <Text style={{ color: RED }}> Invalid Time</Text>}
        </Text>
      ) : (
        <Text
          style={[styles.invalidText, { color: valid ? "rgba(0,0,0,0)" : RED }]}
        >
          Invalid Time
        </Text>
      )}
    </View>
  );
};

const TimeOverlay = ({ actual, value, valid, placeholder }) => {
  const showExpanded = valid && value;
  const showPlaceholder = !actual || !actual.length;
  const transparentText = showExpanded ? actual : "";
  const filledText = showExpanded
    ? value.replace(actual, "")
    : showPlaceholder
    ? placeholder
    : "";
  return (
    <View style={styles.timeOverlay} pointerEvents="none">
      <Text style={styles.timeOverlayText} allowFontScaling={false}>
        <Text style={{ color: "rgba(0,0,0,0)" }}>{transparentText}</Text>
        {filledText}
      </Text>
    </View>
  );
};

const TimeInput = React.forwardRef(
  ({ value, onChangeText, placeholder, name, ...props }, ref) => {
    return (
      <Input
        value={value}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={IOS ? "numbers-and-punctuation" : null}
        name={name}
        ref={ref}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  timeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    paddingLeft: 11
  },
  timeOverlayText: {
    fontSize: WEB ? 14 : 16,
    color: "rgba(0,0,0,0.5)"
  },
  invalid: {
    justifyContent: "flex-end",
    height: 18
  },
  invalidText: {
    fontSize: 10,
    fontWeight: "600"
  }
});
