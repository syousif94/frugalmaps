import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { UPCOMING, NOW, RED } from "../utils/Colors";
import { itemRemaining } from "../utils/Time";

export default ({ style, buttonStyle, contentContainerStyle }) => {
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

      if (ending) {
        const keys = occurringTags.ending[key];
        if (keys) {
          const key = keys[keys.length - 1];
          item = data[key];
          if (item) {
            const { text } = itemRemaining(item);
            subtext = text;
          }
        }
      } else if (upcoming) {
        const upcomingKeys = occurringTags.upcoming[key];
        if (upcomingKeys) {
          const key = upcomingKeys[0];
          item = data[key];
          if (item) {
            const { text } = itemRemaining(item);
            subtext = text.replace(" today", "");
          }
        }
      } else {
        const keys = occurringTags.remaining[key];
        if (keys) {
          const key = keys[0];
          item = data[key];
          if (item) {
            const { remaining } = itemRemaining(item);
            const daysAway = parseInt(remaining.replace("d", ""), 10);
            subtext = `${daysAway} day${daysAway != 1 ? "s" : ""}`;
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
        contentContainerStyle={[
          {
            paddingHorizontal: itemMargin,
            height: 44
          },
          contentContainerStyle
        ]}
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
    requestAnimationFrame(() => {
      dispatch(Events.filter({ tag: selected ? null : text }));
    });
  };
  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: "center",
          marginRight: 8,
          backgroundColor: "rgba(180,180,180,0.1)",
          paddingHorizontal: 8,
          borderRadius: 6
        },
        style
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 14,
          color: selected ? "#000" : "#666",
          fontWeight: "500"
        }}
      >
        {_.lowerCase(text)}
        <Text style={{ color: "#999" }}> {count}</Text>
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: ending ? NOW : upcoming ? UPCOMING : "#999"
        }}
      >
        {subtext}
      </Text>
    </TouchableOpacity>
  );
};
