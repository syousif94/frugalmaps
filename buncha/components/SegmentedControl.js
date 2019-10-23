import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

function backgroundColor(option, selected) {
  let backgroundColor;
  if (option === selected) {
    backgroundColor = "#fff";
  } else {
    backgroundColor = null;
  }

  return { backgroundColor };
}

export default ({
  options = [],
  selected = null,
  onPress = () => {},
  containerStyle = null
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={onPress.bind(null, option)}
          style={[styles.button, backgroundColor(option, selected)]}
        >
          <Text style={[styles.buttonText]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    padding: 1,
    width: "100%",
    maxWidth: 500
  },
  button: {
    paddingVertical: 3,
    borderRadius: 4,
    flex: 1,
    margin: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600"
  }
});
