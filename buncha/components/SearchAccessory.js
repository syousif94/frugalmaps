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
import TimeInput from "./TimeInput";

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
        <BarView>
          <Input />
        </BarView>
        <DayPicker focused={focused} />
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const Input = () => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.filters.time);
  return (
    <TimeInput
      value={value}
      onChangeText={text => {
        dispatch(Filters.setTime(text));
      }}
      placeholder="After"
      name="time"
      placeholderTextColor="#e0e0e0"
      backgroundColor="rgba(255,255,255,0.1)"
      style={{
        height: PICKER_BUTTON_HEIGHT - 2
      }}
      containerStyle={{
        width: 120
      }}
    />
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

const BarView = ({ children }) => {
  return (
    <BlurView
      tint="dark"
      style={{
        height: PICKER_BUTTON_HEIGHT + PICKER_BUTTON_MARGIN * 2,
        padding: PICKER_BUTTON_MARGIN,
        paddingLeft: 7 + PICKER_WIDTH,
        flexDirection: "row"
      }}
    >
      {children}
    </BlurView>
  );
};
