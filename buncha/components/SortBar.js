import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { EVENT_TYPES } from "../utils/Constants";
import { RED } from "../utils/Colors";

const Button = ({ tag: { text, count } }) => {
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
      <View
        style={{
          paddingHorizontal: 3,
          borderRadius: 4,
          backgroundColor: RED,
          marginRight: 9
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff", fontWeight: "700" }}>
          {count}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: "#000", fontWeight: "600" }}>
        {text.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default ({ style }) => {
  const tags = useSelector(state => state.events.tags);
  return (
    <View
      style={[
        {
          marginHorizontal: -2,
          height: 38,
          backgroundColor: "#fff",
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "#f2f2f2"
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
        {tags.map((tag, index) => {
          return <Button tag={tag} key={`${index}`} />;
        })}
      </ScrollView>
    </View>
  );
};
