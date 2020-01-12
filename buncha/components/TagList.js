import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { GREEN, UPCOMING, NOW, NOT_TODAY } from "../utils/Colors";

export default ({ style }) => {
  const occurringTags = useSelector(state => state.events.occurringTags);
  const countedTags = useSelector(state => state.events.tags, shallowEqual);
  const tagsCount = _.keyBy(countedTags, "text");
  let tags = [];
  if (occurringTags) {
    const keys = _.uniq([
      ...Object.keys(occurringTags.ending),
      ...Object.keys(occurringTags.upcoming),
      ...Object.keys(occurringTags.remaining)
    ]);

    tags = keys.map(key => {
      return {
        text: key,
        count: tagsCount[key].count,
        upcoming: occurringTags.upcoming[key]
          ? occurringTags.upcoming[key].length
          : 0,
        ending: occurringTags.ending[key] ? occurringTags.ending[key].length : 0
      };
    });
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      horizontal
      style={[{ height: 50 }, style]}
      contentContainerStyle={{
        paddingHorizontal: itemMargin - 5
      }}
    >
      {tags.map((tag, index) => {
        return <Button tag={tag} key={`${index}`} />;
      })}
    </ScrollView>
  );
};

const Button = ({ tag: { text, count, ending, upcoming } }) => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state.events.tag === text);
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
          marginVertical: 6
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
            color: selected ? "#ccc" : "#000",
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
            {ending ? <Text style={{ color: UPCOMING }}>{ending}</Text> : null}
            {upcoming ? (
              <Text style={{ color: NOT_TODAY }}>{upcoming}</Text>
            ) : null}
          </Text>
          {count !== ending + upcoming ? (
            <Text
              style={{
                fontSize: 15,
                color: "#ccc",
                fontWeight: "700"
              }}
            >
              {count > 1 ? count : null}
            </Text>
          ) : null}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
