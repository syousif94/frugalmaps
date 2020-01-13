import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { UPCOMING, NOW } from "../utils/Colors";
import { itemRemaining } from "../utils/Time";

export default ({ style }) => {
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
        const endingKeys = occurringTags.ending[key];
        const key = endingKeys[endingKeys.length - 1];
        item = data[key];
        if (item) {
          const { text } = itemRemaining(item);
          subtext = text;
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
    <View style={[{ height: 50 }, style]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: itemMargin - 5
        }}
      >
        {tags.map((tag, index) => {
          return <Button tag={tag} key={`${index}`} />;
        })}
      </ScrollView>
    </View>
  );
};

const Button = ({ tag: { text, count, ending, upcoming, subtext } }) => {
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
    <View
      style={[
        {
          marginVertical: 6,
          borderRadius: 5
        }
      ]}
    >
      <TouchableOpacity
        style={[
          {
            flex: 1,
            paddingHorizontal: 5,
            justifyContent: "center"
          }
        ]}
        onPress={onPress}
      >
        <Text
          style={{
            fontSize: 15,
            color: selected ? "#000" : tag ? "#777" : "#000",
            fontWeight: "700"
          }}
        >
          {_.lowerCase(text)}{" "}
          <Text
            style={{
              fontSize: 17,
              color: "#ccc",
              fontWeight: "800"
            }}
          >
            {ending ? <Text style={{ color: NOW }}>{ending}</Text> : null}
            {upcoming ? (
              <Text style={{ color: UPCOMING }}>{upcoming}</Text>
            ) : null}
          </Text>
          {count !== ending + upcoming ? (
            <Text
              style={{
                fontSize: 15,
                color: "#aaa",
                fontWeight: "700"
              }}
            >
              {count > 1 ? count : null}
            </Text>
          ) : null}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#555",
            fontWeight: "700"
          }}
        >
          {subtext}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
