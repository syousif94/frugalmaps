import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BLUE } from "../utils/Colors";
import { selectList } from "../store/cities";

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
        style={styles.button}
      >
        <Text
          style={[
            styles.buttonText,
            { color: currentList === "closest" ? BLUE : "#000" }
          ]}
        >
          Closest
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPress.bind(null, "popular")}
        style={styles.button}
      >
        <Text
          style={[
            styles.buttonText,
            { color: currentList === "popular" ? BLUE : "#000" }
          ]}
        >
          Popular
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  button: {
    height: 38,
    paddingHorizontal: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600"
  },
  selected: {
    color: BLUE
  }
});
