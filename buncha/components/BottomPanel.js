import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Keyboard } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useDimensions } from "../utils/Hooks";
import BlurView from "./BlurView";
import EventSearchInput from "./EventSearchInput";
import PickerButton, { buttonHeight } from "./PickerButton";
import MenuButton from "./MenuButton";
import TagList from "./TagList";
import { ANDROID } from "../utils/Constants";

export default () => {
  const insets = useSafeArea();
  const [dimensions] = useDimensions();
  const panelHeight = dimensions.height * 0.76;
  const bottomInset = insets.bottom || 12;
  const maxTranslate = panelHeight - buttonHeight - bottomInset;

  const [animation, keyboardHeight] = useAnimateOnKeyboard();

  const panelTransform = {
    translateY: animation.current.interpolate({
      inputRange: [0, 1],
      outputRange: [maxTranslate, 0]
    })
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        transform: [panelTransform]
      }}
    >
      <BlurView>
        <View
          style={{
            height: panelHeight,
            borderTopWidth: 1,
            borderColor: "rgba(0,0,0,0.05)"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
              marginHorizontal: 5
            }}
          >
            <EventSearchInput contentContainerStyle={{ flex: 1 }} />
            <PickerButton />
            <MenuButton />
          </View>
          <TagList bottomInset={keyboardHeight} />
        </View>
      </BlurView>
    </Animated.View>
  );
};

const KEYBOARD_EVENTS = ANDROID
  ? ["keyboardDidShow", "keyboardDidHide"]
  : ["keyboardWillShow", "keyboardWillHide"];

function useAnimateOnKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    const onShow = e => {
      const height = e.endCoordinates.height;
      Animated.timing(
        animation.current,
        {
          toValue: 1,
          duration: e.duration
        },
        { useNativeDriver: true }
      ).start(() => {
        setKeyboardHeight(height);
      });
    };

    const onHide = e => {
      Animated.timing(
        animation.current,
        {
          toValue: 0,
          duration: ANDROID ? 150 : e.duration
        },
        { useNativeDriver: true }
      ).start(() => {
        setKeyboardHeight(0);
      });
    };

    Keyboard.addListener(KEYBOARD_EVENTS[0], onShow);

    Keyboard.addListener(KEYBOARD_EVENTS[1], onHide);

    return () => {
      Keyboard.removeListener(KEYBOARD_EVENTS[0], onShow);
      Keyboard.removeListener(KEYBOARD_EVENTS[1], onHide);
    };
  });

  return [animation, keyboardHeight];
}
