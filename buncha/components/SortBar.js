import React, { memo } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RED } from "../utils/Colors";
import _ from "lodash";
import * as Events from "../store/events";

const Button = ({ tag: { text, count }, style }) => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state.events.tag === text);
  const onPress = () => {
    dispatch(Events.filter({ tag: selected ? null : text }));
  };
  return (
    <View
      style={[
        {
          backgroundColor: selected ? "#bbb" : RED,
          borderRadius: 4,
          marginHorizontal: 2
        },
        style
      ]}
    >
      <TouchableOpacity
        style={[
          {
            alignItems: "center",
            flexDirection: "row"
          }
        ]}
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
    </View>
  );
};

export default memo(
  ({
    style = {},
    contentContainerStyle = {},
    buttonStyle = {},
    onLayout = null
  }) => {
    const tags = useSelector(state => state.events.tags, shallowEqual);
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
        onLayout={onLayout}
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
            return <Button tag={tag} key={`${index}`} style={buttonStyle} />;
          })}
        </ScrollView>
      </View>
    );
  }
);
