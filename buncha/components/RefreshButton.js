import React, { useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useEveryMinute } from "../utils/Hooks";

export default () => {
  const visible = useRef(false);
  const animation = useRef(new Animated.Value(0));

  const staleTime = useSelector(state => {
    if (state.events.staleMs && state.events.now) {
      return state.events.now + state.events.staleMs;
    }
    return null;
  });

  const [currentTime] = useEveryMinute();

  if (staleTime && currentTime >= staleTime) {
    if (!visible.current) {
      visible.current = true;
      Animated.timing(
        animation.current,
        { toValue: visible.current ? 1 : 0, duration: 200 },
        { useNativeDriver: true }
      ).start();
    }
  }

  return (
    <Animated.View>
      <TouchableOpacity>
        <Text>Tap to Refresh</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
