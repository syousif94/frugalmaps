import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectList } from "../store/cities";

function backgroundColor(current, matches) {
  let backgroundColor;
  if (current === matches) {
    backgroundColor = "rgba(255, 255, 255, 0.7)";
  } else {
    backgroundColor = null;
  }

  return { backgroundColor };
}

export default () => {
  const dispatch = useDispatch();
  const currentList = useSelector(state => state.cities.list);
  const onPress = key => {
    dispatch(selectList(key));
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress.bind(null, "closest")}
        style={[styles.button, backgroundColor(currentList, "closest")]}
      >
        <Text style={[styles.buttonText]}>Closest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPress.bind(null, "popular")}
        style={[styles.button, backgroundColor(currentList, "popular")]}
      >
        <Text style={[styles.buttonText]}>Popular</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    alignSelf: "flex-start",
    marginVertical: 8,
    borderRadius: 6,
    padding: 2
  },
  button: {
    paddingVertical: 6,
    borderRadius: 4,
    paddingHorizontal: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600"
  }
});
