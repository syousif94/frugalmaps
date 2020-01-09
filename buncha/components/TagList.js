import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Animated
} from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import * as Events from "../store/events";
import { tabBarHeight } from "./TabBar";
import BlurView from "./BlurView";
import { GREEN, UPCOMING } from "../utils/Colors";
import { InputContext } from "./InputContext";
import { IOS } from "../utils/Constants";

export default () => {
  const [focused] = useContext(InputContext);
  const [animate] = useAnimateOnFocus(focused);
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
    <KeyboardAvoidingView
      behavior="position"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      pointerEvents={focused ? "box-none" : "none"}
    >
      <Animated.View style={{ opacity: animate.current }}>
        <View style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 1 }} />
        <BlurView tint="dark">
          <ScrollView
            keyboardShouldPersistTaps="handled"
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
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

function useAnimateOnFocus(focused) {
  const animation = useRef(new Animated.Value(0));
  useEffect(() => {
    const toValue = focused ? 1 : 0;
    if (IOS) {
      Animated.timing(
        animation.current,
        { toValue, duration: 250 },
        { useNativeDriver: true }
      ).start();
    } else {
      animation.current.setValue(toValue);
    }
  }, [focused]);

  return [animation];
}

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
