import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RED } from "../utils/Colors";
import _ from "lodash";
import * as Events from "../store/events";

const Button = ({ tag: { text, count } }) => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state.events.tag === text);
  const onPress = () => {
    dispatch(Events.filter({ tag: selected ? null : text }));
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? "#bbb" : RED,
        paddingVertical: 3,
        borderRadius: 4,
        paddingLeft: 5,
        paddingRight: 3,
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: 2
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 12, color: "#fff", fontWeight: "700" }}>
        {_.startCase(text)}
      </Text>
      <View
        style={{
          paddingHorizontal: 3,
          borderRadius: 3,
          backgroundColor: "rgba(0,0,0,0.3)",
          marginLeft: 6,
          minWidth: 16,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 12, color: "#fff", fontWeight: "700" }}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ({ style = {}, contentContainerStyle = {} }) => {
  const tags = useSelector(state => state.events.tags);
  if (!tags.length) {
    return null;
  }
  return (
    <View
      style={[
        {
          backgroundColor: "#fff"
        },
        style
      ]}
    >
      <ScrollView
        style={{
          flex: 1
        }}
        contentContainerStyle={[
          { paddingHorizontal: 2, paddingVertical: 4 },
          contentContainerStyle
        ]}
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
