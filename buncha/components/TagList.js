import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  PixelRatio
} from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { tabBarHeight } from "./TabBar";
import BlurView from "./BlurView";
import { GREEN, UPCOMING } from "../utils/Colors";

export default () => {
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

  console.log(tags);

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      pointerEvents="box-none"
      keyboardVerticalOffset={-tabBarHeight}
    >
      <View style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 1 }} />
      <BlurView
        tint="dark"
        style={{
          marginBottom: tabBarHeight
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ height: 50 }}
          contentContainerStyle={{
            paddingHorizontal: itemMargin / 2 - 4
          }}
        >
          {tags.map((tag, index) => {
            return <Button tag={tag} key={`${index}`} />;
          })}
        </ScrollView>
      </BlurView>
    </KeyboardAvoidingView>
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
        <Text style={{ fontSize: 15, color: "#fff", fontWeight: "700" }}>
          {_.lowerCase(text)}{" "}
          <Text
            style={{
              fontSize: 17,
              color: "#ccc",
              fontWeight: "800"
            }}
          >
            {ending ? <Text style={{ color: GREEN }}>{ending}</Text> : null}
            {upcoming ? (
              <Text style={{ color: UPCOMING }}>{upcoming}</Text>
            ) : null}
          </Text>
          {!ending && !upcoming ? (
            <Text
              style={{
                fontSize: 15,
                color: "#999",
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
