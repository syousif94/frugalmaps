import React, { useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { UPCOMING, NOW } from "../utils/Colors";
import { itemRemaining } from "../utils/Time";
import { usePreventBackScroll } from "../utils/Hooks";
import { ANDROID } from "../utils/Constants";

export const TAG_LIST_HEIGHT = 88;

export default ({ style, buttonStyle, contentContainerStyle }) => {
  const scrollRef = useRef(null);
  usePreventBackScroll(scrollRef);
  const occurringTags = useSelector(state => state.events.occurringTags);
  const countedTags = useSelector(state => state.events.tags, shallowEqual);
  const data = useSelector(state => state.events.data, shallowEqual);
  const tagsCount = _.keyBy(countedTags, "text");
  return (
    <View style={style}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={[
          {
            height: TAG_LIST_HEIGHT
          }
        ]}
      >
        <View style={contentContainerStyle}>
          {makeTags(
            occurringTags,
            countedTags,
            data,
            tagsCount,
            buttonStyle
          ).map(row => {
            return <View style={{ flexDirection: "row", flex: 1 }}>{row}</View>;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const ROWS = 2;

function makeTags(occurringTags, countedTags, data, tagsCount, buttonStyle) {
  if (occurringTags && countedTags.length) {
    const keys = _.uniq([
      ...Object.keys(occurringTags.ending),
      ...Object.keys(occurringTags.upcoming),
      ...Object.keys(occurringTags.remaining)
    ]);

    const rows = Array.from({ length: ROWS }, () => []);

    return keys.reduce((rows, key, index) => {
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
      const tag = {
        text: key,
        count: tagsCount[key].count,
        upcoming,
        ending,
        subtext
      };
      const rowIndex = index % ROWS;
      rows[rowIndex].push(
        <Button tag={tag} key={`${index}`} style={buttonStyle} />
      );
      return rows;
    }, rows);
  }

  return [];
}

const Button = ({ tag: { text, count, ending, upcoming, subtext }, style }) => {
  const dispatch = useDispatch();
  const tag = useSelector(state => state.events.tag);
  const selected = tag === text;
  const onPress = () => {
    dispatch(Events.filter({ tag: selected ? null : text }));
  };
  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: "center",
          backgroundColor: selected
            ? "rgba(40,40,40,0.1)"
            : "rgba(180,180,180,0.1)",
          paddingHorizontal: 6,
          borderRadius: 6,
          margin: 2.5
        },
        style
      ]}
      onPress={onPress}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 14,
          color: "#666",
          fontWeight: ANDROID ? "700" : "600"
        }}
      >
        {_.lowerCase(text)}
        <Text style={{ color: "#999" }}> {count}</Text>
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 12,
          fontWeight: ANDROID ? "700" : "600",
          color: ending ? NOW : upcoming ? UPCOMING : "#999"
        }}
      >
        {subtext}
      </Text>
    </TouchableOpacity>
  );
};
