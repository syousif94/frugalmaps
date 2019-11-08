import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import { ALL_PAGES } from "../screens/SubmitScreen";
import { RED } from "../utils/Colors";

function segmentBackgroundColor(option, selected) {
  let backgroundColor;
  if (option === selected) {
    backgroundColor = "#fff";
  } else {
    backgroundColor = null;
  }

  return { backgroundColor };
}

export default ({ option, style, selected, onPress }) => {
  const count = useSelector(state => {
    switch (option) {
      case ALL_PAGES[1]:
        return state.submissions.list.length;
      case ALL_PAGES[2]:
        return state.submissions.published.length;
      default:
        return null;
    }
  }, shallowEqual);
  return (
    <TouchableOpacity
      key={option}
      onPress={onPress.bind(null, option)}
      style={[
        style,
        styles.segmentItem,
        segmentBackgroundColor(option, selected)
      ]}
    >
      {count > 0 ? (
        <View style={styles.count}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
      <Text style={[styles.buttonText]}>{option}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  segmentItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 3
  },
  count: {
    paddingHorizontal: 2,
    borderRadius: 3,
    backgroundColor: RED,
    marginRight: 4,
    minWidth: 14,
    alignItems: "center"
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff"
  }
});
