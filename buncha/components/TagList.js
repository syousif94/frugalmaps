import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { UPCOMING, NOW, RED } from "../utils/Colors";
import { itemRemaining } from "../utils/Time";

export default ({ style, buttonStyle }) => {
  const occurringTags = useSelector(state => state.events.occurringTags);
  const countedTags = useSelector(state => state.events.tags, shallowEqual);
  const data = useSelector(state => state.events.data, shallowEqual);
  const tagsCount = _.keyBy(countedTags, "text");
  let tags = [];
  if (occurringTags) {
    const keys = _.uniq([
      ...Object.keys(occurringTags.ending),
      ...Object.keys(occurringTags.upcoming),
      ...Object.keys(occurringTags.remaining)
    ]);

    tags = keys.map(key => {
      const ending = occurringTags.ending[key]
        ? occurringTags.ending[key].length
        : 0;

      const upcoming = occurringTags.upcoming[key]
        ? occurringTags.upcoming[key].length
        : 0;

      let item;

      let subtext = "";

      if (upcoming) {
        const upcomingKeys = occurringTags.upcoming[key];
        if (upcomingKeys) {
          const key = upcomingKeys[0];
          item = data[key];
          if (item) {
            const { text } = itemRemaining(item);
            subtext = text.replace(" today", "");
          }
        }
      } else if (ending) {
        const keys = occurringTags.ending[key];
        if (keys) {
          const key = keys[keys.length - 1];
          item = data[key];
          if (item) {
            const { text } = itemRemaining(item);
            subtext = text;
          }
        }
      } else {
        const keys = occurringTags.remaining[key];
        if (keys) {
          const key = keys[0];
          item = data[key];
          if (item) {
            const { remaining } = itemRemaining(item);
            subtext = remaining.replace("d", " days");
          }
        }
      }

      return {
        text: key,
        count: tagsCount[key].count,
        upcoming,
        ending,
        subtext
      };
    });
  }
  return (
    <View style={style}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: itemMargin,
          height: 44
        }}
      >
        {tags.map((tag, index) => {
          return <Button tag={tag} key={`${index}`} style={buttonStyle} />;
        })}
      </ScrollView>
    </View>
  );
};

const Button = ({ tag: { text, count, ending, upcoming, subtext }, style }) => {
  const dispatch = useDispatch();
  const tag = useSelector(state => state.events.tag);
  const selected = tag === text;
  const onPress = () => {
    // inputRef.current.blur();
    requestAnimationFrame(() => {
      dispatch(Events.filter({ tag: selected ? null : text }));
    });
  };
  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: "center",
          marginRight: 15
        },
        style
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 14,
          color: selected ? "#000" : "#777",
          fontWeight: "700"
        }}
      >
        {_.lowerCase(text)}
        {count !== ending + upcoming ? (
          <Text
            style={{
              fontSize: 14,
              color: "#666"
            }}
          >
            {" "}
            {count > 1 ? count : null}
          </Text>
        ) : null}
      </Text>
      <Text
        style={{
          marginTop: 2,
          fontSize: 14,
          color: "#444",
          fontWeight: "600"
        }}
      >
        {ending ? (
          <Text style={{ fontSize: 14, fontWeight: "800", color: NOW }}>
            {ending}
          </Text>
        ) : null}
        {upcoming ? (
          <Text style={{ color: UPCOMING, fontSize: 14, fontWeight: "800" }}>
            {upcoming}
          </Text>
        ) : null}
        {upcoming || ending ? " " : ""}
        {subtext}
      </Text>
    </TouchableOpacity>
  );
};
