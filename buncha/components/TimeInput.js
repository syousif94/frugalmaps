import React from "react";
import Input from "./Input";
import { View, Text, StyleSheet } from "react-native";
import { detruncateTime, validateTime } from "../utils/Time";
import { RED } from "../utils/Colors";

export default React.forwardRef(
  (
    { value, onChangeText, placeholder, containerStyle = {}, name, ...props },
    ref
  ) => {
    let valid = true;
    let expandedTime = null;
    if (value.trim().length) {
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
            placeholder={placeholder}
            name={name}
            ref={ref}
            {...props}
          />
          <TimeOverlay actual={value} value={expandedTime} valid={valid} />
        </View>
        <TimeInvalid valid={valid} />
      </View>
    );
  }
);

const TimeInvalid = ({ valid }) => {
  return (
    <View style={styles.invalid}>
      <Text
        style={[styles.invalidText, { color: valid ? "rgba(0,0,0,0)" : RED }]}
      >
        Invalid Time
      </Text>
    </View>
  );
};

const TimeOverlay = ({ actual, value, valid }) => {
  if (!valid || !value) {
    return null;
  }
  return (
    <View style={styles.timeOverlay} pointerEvents="none">
      <Text style={styles.timeOverlayText}>
        <Text style={{ color: "rgba(0,0,0,0)" }}>{actual}</Text>
        {value.replace(actual, "")}
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
    fontSize: 14,
    color: "rgba(0,0,0,0.5)"
  },
  invalid: {
    justifyContent: "flex-end",
    height: 18
  },
  invalidText: {
    fontSize: 13
  }
});
