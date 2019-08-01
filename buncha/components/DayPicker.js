import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DAYS } from "../utils/Constants";
import { BLUE } from "../utils/Colors";

export default ({ toggle, selector }) => {
  const selectedDays = useSelector(selector);
  const dispatch = useDispatch();
  return (
    <View style={styles.tags}>
      {DAYS.map((day, index) => {
        const tagStyle = [styles.tag];
        const textStyle = [styles.tagText];
        const selected = selectedDays.indexOf(index) > -1;
        if (selected) {
          tagStyle.push(styles.selected);
          textStyle.push(styles.selectedText);
        }
        if (index === 0) {
          tagStyle.push({ marginLeft: 0 });
        } else if (index === DAYS.length - 1) {
          tagStyle.push({ marginRight: 0 });
        }
        return (
          <TouchableOpacity
            key={`${index}`}
            style={tagStyle}
            onPress={() => {
              dispatch(toggle(index));
            }}
          >
            <Text style={textStyle}>{day}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tags: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tag: {
    height: 28,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    marginHorizontal: 2.5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  selected: {
    backgroundColor: BLUE
  },
  tagText: {
    fontSize: 14,
    color: "#000"
  },
  selectedText: {
    color: "#fff"
  }
});
