import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../store/submission";
import { EVENT_TYPES } from "../utils/Constants";
import { BLUE } from "../utils/Colors";

const toggleTag = toggle("tags");

export default () => {
  const selectedTags = useSelector(state => state.submission.tags);
  const dispatch = useDispatch();
  return (
    <View style={styles.tags}>
      {EVENT_TYPES.map((tag, index) => {
        const tagStyle = [styles.tag];
        const textStyle = [styles.tagText];
        const selected = selectedTags.indexOf(tag) > -1;
        if (selected) {
          tagStyle.push(styles.selected);
          textStyle.push(styles.selectedText);
        }
        return (
          <TouchableOpacity
            key={`${index}`}
            style={tagStyle}
            onPress={() => {
              dispatch(toggleTag(tag));
            }}
          >
            <Text style={textStyle}>{tag}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tags: {
    paddingVertical: 2.5,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tag: {
    height: 28,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
    marginRight: 5,
    marginVertical: 2.5
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
