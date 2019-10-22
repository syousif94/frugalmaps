import React, { useRef, useState, useEffect } from "react";
import { Animated, Easing, Keyboard } from "react-native";
import { ANDROID } from "./Constants";

function repeatEvery(func, interval) {
  let canceled = false;

  function repeater() {
    if (canceled) {
      return;
    }
    repeatEvery(func, interval);
    func();
  }

  var now = new Date();
  var delay = interval - (now % interval);

  setTimeout(repeater, delay);

  return () => {
    canceled = true;
  };
}

export function useEveryMinute() {
  const [state, setState] = useState(Date.now());

  useEffect(() => {
    const cancel = repeatEvery(() => {
      setState(Date.now());
    }, 60 * 1000);

    return () => cancel();
  }, []);

  return [state];
}

export function useAnimateOn(value, duration = 150, easing = Easing.linear) {
  const [internalValue, setInteralValue] = useState(null);

  const transform = useRef(new Animated.Value(0));

  useEffect(() => {
    if (internalValue !== value) {
      let toValue;

      if (value && !internalValue) {
        toValue = 1;
      } else if (internalValue && !value) {
        toValue = 0;
      }

      if (value && value !== internalValue) {
        setInteralValue(value);
      }

      if (toValue !== undefined) {
        requestAnimationFrame(() => {
          Animated.timing(
            transform.current,
            { toValue, duration, easing },
            { useNativeDriver: true }
          ).start(() => {
            if (!toValue) {
              setInteralValue(value);
            }
          });
        });
      } else if (ANDROID && value) {
        setInteralValue(value);
      }
    }
  }, [value, internalValue, easing]);

  return [internalValue, transform];
}

const KEYBOARD_EVENTS = ANDROID
  ? ["keyboardDidShow", "keyboardDidHide"]
  : ["keyboardWillShow", "keyboardWillHide"];

const KEYBOARD_EASING = ANDROID
  ? Easing.linear
  : Easing.bezier(0.17, 0.59, 0.4, 0.77);

export function useKeyboardHeight(bottomOffset = 0) {
  const heightRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const onShow = e => {
      Animated.timing(
        heightRef.current,
        {
          toValue: -e.endCoordinates.height + bottomOffset,
          duration: e.duration,
          easing: KEYBOARD_EASING
        },
        { useNativeDriver: true }
      ).start();
    };

    const onHide = e => {
      Animated.timing(
        heightRef.current,
        {
          toValue: 0,
          duration: e.duration,
          easing: KEYBOARD_EASING
        },
        { useNativeDriver: true }
      ).start();
    };

    Keyboard.addListener(KEYBOARD_EVENTS[0], onShow);

    Keyboard.addListener(KEYBOARD_EVENTS[1], onHide);

    return () => {
      Keyboard.removeListener(KEYBOARD_EVENTS[0], onShow);
      Keyboard.removeListener(KEYBOARD_EVENTS[1], onHide);
    };
  }, []);

  return [heightRef];
}
