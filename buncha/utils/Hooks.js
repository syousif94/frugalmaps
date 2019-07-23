import React, { useCallback, useRef } from "react";
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
