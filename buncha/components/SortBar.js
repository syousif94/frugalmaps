import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RED } from "../utils/Colors";
import _ from "lodash";

const Button = ({ tag: { text, count } }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#f7f7f7",
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
          marginRight: 6,
          minWidth: 16,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff", fontWeight: "700" }}>
          {count}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: "#000", fontWeight: "600" }}>
        {_.startCase(text)}
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
          height: 44,
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
        {tags.map((tag, index) => {
          return <Button tag={tag} key={`${index}`} />;
        })}
      </ScrollView>
    </View>
  );
};
