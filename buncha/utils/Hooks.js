import React, { useRef, useState, useEffect } from "react";
import { Animated, Easing, Keyboard, Dimensions } from "react-native";
import { ANDROID, WEB } from "./Constants";

export function useDimensions() {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener("change", onChange);

    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  return [dimensions];
}

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

const minuteSet = new Set();

repeatEvery(() => {
  const now = Date.now();
  minuteSet.forEach(cb => {
    cb(now);
  });
}, 60 * 1000);

export function useEveryMinute() {
  const [state, setState] = useState();

  useEffect(() => {
    const onMinute = date => {
      setState(date);
    };

    minuteSet.add(onMinute);

    return () => {
      minuteSet.delete(onMinute);
    };
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

export function useKeyboardHeight() {
  const heightRef = useRef(new Animated.Value(0));
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const onShow = e => {
      Animated.timing(
        heightRef.current,
        {
          toValue: Math.min(-(e.endCoordinates.height + bottomOffset), 0),
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
          duration: ANDROID ? 150 : e.duration,
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
  }, [bottomOffset]);

  return [heightRef, setBottomOffset];
}

export function usePreventBackScroll(scrollRef) {
  useEffect(() => {
    if (WEB) {
      const scrollView = scrollRef.current.getScrollableNode();

      let lastScroll;

      function onWheel(e) {
        const now = Date.now();

        if (lastScroll && now - lastScroll <= 32) {
          lastScroll = now;
          return;
        }

        lastScroll = now;

        const maxX = this.scrollWidth - this.offsetWidth;

        if (
          this.scrollLeft + event.deltaX < 0 ||
          this.scrollLeft + event.deltaX > maxX
        ) {
          e.preventDefault();
        }
      }

      scrollView.addEventListener("wheel", onWheel);
      scrollView.addEventListener("touchmove", onWheel);

      return () => {
        scrollView.removeEventListener("wheel", onWheel);
        scrollView.removeEventListener("touchmove", onWheel);
      };
    }
  }, []);
}
