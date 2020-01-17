import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEveryMinute } from "../utils/Hooks";
import { useSafeArea } from "react-native-safe-area-context";
import { BLUE } from "../utils/Colors";
import { refresh } from "../store/events";

export default () => {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const visible = useRef(false);
  const animation = useRef(new Animated.Value(0));

  const staleTime = useSelector(state => {
    if (state.events.staleMs && state.events.now) {
      return Math.floor((state.events.now + state.events.staleMs) / 60000);
    }
    return null;
  });

  const [currentTime] = useEveryMinute();

  useEffect(() => {
    const current = Math.floor(currentTime / 60000);
    if (staleTime && current >= staleTime && !visible.current) {
      visible.current = true;
      Animated.timing(
        animation.current,
        { toValue: visible.current ? 1 : 0, duration: 250 },
        { useNativeDriver: true }
      ).start();
    }
  }, [staleTime, currentTime]);

  const containerStyle = {
    position: "absolute",
    top: insets.top + 10,
    alignSelf: "center",
    opacity: animation.current,
    transform: [
      {
        translateY: animation.current.interpolate({
          inputRange: [0, 1],
          outputRange: [60, 0]
        })
      }
    ],
    backgroundColor: BLUE,
    shadowColor: "#000",
    height: 34,
    borderRadius: 17,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  };

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity
        style={{ paddingHorizontal: 12, justifyContent: "center", flex: 1 }}
        onPress={() => {
          if (!visible.current) {
            return;
          }
          visible.current = false;
          Animated.timing(
            animation.current,
            { toValue: visible.current ? 1 : 0, duration: 250 },
            { useNativeDriver: true }
          ).start(() => {
            dispatch(refresh());
          });
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Tap to Refresh</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
