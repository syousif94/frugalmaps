import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";
import { EVENT_TYPES } from "../utils/Constants";

const buttons = ["Up Next", ...EVENT_TYPES];

const Button = ({ text }) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 5,
        paddingHorizontal: 6,
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: 2.5
      }}
    >
      <Text style={{ fontSize: 12, color: "#000" }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ({ style }) => {
  return (
    <View
      style={[
        {
          height: 38,
          backgroundColor: "#fff"
        },
        style
      ]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 5, paddingHorizontal: 2.5 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {buttons.map((text, index) => {
          return <Button text={text} key={`${index}`} />;
        })}
      </ScrollView>
    </View>
  );
};
