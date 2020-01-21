import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated
} from "react-native";
import _ from "lodash";
import BlurView from "./BlurView";
import { InputContext } from "./InputContext";
import { IOS, ANDROID } from "../utils/Constants";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Filters from "../store/filters";
import { Entypo } from "@expo/vector-icons";

export default () => {
  const [focused] = useContext(InputContext);
  const [animate] = useAnimateOnFocus(focused);

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      pointerEvents={focused ? "box-none" : "none"}
      keyboardVerticalOffset={ANDROID ? 24 : null}
    >
      <Animated.View
        style={{
          opacity: animate.current
        }}
        pointerEvents={focused ? "box-none" : "none"}
      >
        <BarView />
        <DayPicker focused={focused} />
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

const PICKER_BUTTON_HEIGHT = 38;
const PICKER_BUTTON_MARGIN = 5;

const DayPicker = ({ focused }) => {
  const open = useRef(false);
  const height = useRef(0);

  const pickerTransform = useRef(new Animated.Value(0));
  const daysTransform = useRef(new Animated.Value(0));

  const selectedDay = useSelector(state => state.filters.day, shallowEqual);

  const dispatch = useDispatch();
  const tag = useSelector(state => state.events.tag, shallowEqual);
  const occurringTags = useSelector(
    state => state.events.occurringTags,
    shallowEqual
  );
  const calendar = useSelector(
    state => state.events.calendar.sort((a, b) => a.iso - b.iso),
    shallowEqual
  );

  const closePickerAnimated = selectedDay => {
    const index = calendar.findIndex(day => day.title === selectedDay.title);
    if (index < 0) {
      return;
    }
    const toValue = index * -PICKER_BUTTON_HEIGHT;
    Animated.parallel([
      Animated.timing(
        daysTransform.current,
        { toValue, duration: 150 },
        { useNativeDriver: true }
      ),
      Animated.timing(
        pickerTransform.current,
        {
          toValue: height.current - PICKER_BUTTON_HEIGHT,
          duration: 150
        },
        { useNativeDriver: true }
      )
    ]).start(() => {
      open.current = false;
    });
  };

  useEffect(() => {
    if (open.current) {
      return;
    }

    const index = calendar.findIndex(day => day.title === selectedDay.title);

    if (index < 0) {
      return;
    }

    const toValue = index * -PICKER_BUTTON_HEIGHT;

    daysTransform.current.setValue(toValue);
  }, [calendar, selectedDay]);

  useEffect(() => {
    if (!focused && open.current) {
      closePickerAnimated(selectedDay);
    }
  }, [focused, calendar, selectedDay]);

  let eventSet;
  if (tag) {
    const allTags = ["ending", "remaining", "upcoming"].reduce((ids, key) => {
      if (occurringTags[key] && occurringTags[key][tag]) {
        return [...ids, ...occurringTags[key][tag]];
      }

      return ids;
    }, []);
    eventSet = new Set(allTags);
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: PICKER_BUTTON_MARGIN,
        left: 3,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: "hidden"
      }}
      pointerEvents="box-none"
    >
      <Animated.View
        pointerEvents="box-none"
        style={{
          borderRadius: 5,
          overflow: "hidden",
          transform: [
            {
              translateY: pickerTransform.current
            }
          ]
        }}
      >
        <Animated.View
          pointerEvents="box-none"
          onLayout={e => {
            height.current = e.nativeEvent.layout.height;
            pickerTransform.current.setValue(
              height.current - PICKER_BUTTON_HEIGHT
            );
          }}
          style={{
            transform: [
              {
                translateY: daysTransform.current
              }
            ]
          }}
        >
          <BlurView tint="dark">
            {calendar.map(day => {
              let data = day.data;
              if (eventSet) {
                data = data.filter(event => eventSet.has(event._id));
              }
              const eventCount = `${data.length}`;
              return (
                <TouchableOpacity
                  key={day.title}
                  style={{
                    height: PICKER_BUTTON_HEIGHT,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 150
                  }}
                  onPress={() => {
                    if (open.current) {
                      dispatch(Filters.setDay(day));
                      closePickerAnimated(day);
                    } else {
                      open.current = true;
                      Animated.parallel([
                        Animated.timing(
                          pickerTransform.current,
                          {
                            toValue: 0,
                            duration: 150
                          },
                          { useNativeDriver: true }
                        ),
                        Animated.timing(
                          daysTransform.current,
                          {
                            toValue: 0,
                            duration: 150
                          },
                          { useNativeDriver: true }
                        )
                      ]).start();
                    }
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      paddingLeft: 9
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}
                    >
                      {day.title}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{ color: "#e0e0e0", fontSize: 12 }}
                    >
                      {daysAwayText(day.away)}
                    </Text>
                  </View>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "#fff", fontSize: 14, marginRight: 20 }}
                  >
                    {eventCount}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </Animated.View>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          right: 7,
          bottom: 0,
          height: PICKER_BUTTON_HEIGHT,
          justifyContent: "center",
          opacity: pickerTransform.current.interpolate({
            inputRange: [0, Math.max(height.current - 40, 1)],
            outputRange: [0, 1]
          })
        }}
      >
        <Entypo
          name="chevron-up"
          color="#fff"
          size={11}
          style={{ marginBottom: -5 }}
        />
        <Entypo name="chevron-down" color="#fff" size={11} />
      </Animated.View>
    </View>
  );
};

function daysAwayText(away) {
  switch (away) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    default:
      return `${away} days away`;
  }
}

const BarView = () => {
  return (
    <BlurView
      tint="dark"
      style={{
        height: PICKER_BUTTON_HEIGHT + PICKER_BUTTON_MARGIN * 2
      }}
    />
  );
};
