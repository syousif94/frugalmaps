import React, { useCallback, useRef, useState, useEffect } from "react";
import { Animated } from "react-native";

export function useCitiesToggle() {
  const citiesTranslate = useRef(new Animated.Value(0));
  const citiesVisible = useRef(false);

  const toggleCities = useCallback(() => {
    citiesVisible.current = !citiesVisible.current;
    const toValue = citiesVisible.current ? 1 : 0;
    Animated.timing(
      citiesTranslate.current,
      { toValue, duration: 350 },
      { useNativeDriver: true }
    ).start();
  }, []);

  return [citiesTranslate, toggleCities];
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

export function useEveryMinute() {
  const [state, setState] = useState();

  useEffect(() => {
    const cancel = repeatEvery(() => {
      setState(Date.now());
    }, 60 * 1000);

    return () => cancel();
  }, []);

  return [state];
}
