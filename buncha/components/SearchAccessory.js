import React, { useContext, useEffect, useRef } from "react";
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
import { IOS } from "../utils/Constants";

export default () => {
  const [focused] = useContext(InputContext);
  const [animate] = useAnimateOnFocus(focused);

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      pointerEvents={focused ? "box-none" : "none"}
    >
      <Animated.View style={{ opacity: animate.current }}>
        <ChangeTimeButton />
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

const ChangeTimeButton = () => {
  return (
    <View
      style={{ alignItems: "flex-end", paddingBottom: 2, paddingRight: 2 }}
      pointerEvents="box-none"
    >
      <BlurView tint="dark" style={{ borderRadius: 5 }}>
        <TouchableOpacity
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            paddingHorizontal: 8,
            paddingVertical: 5
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            When?
          </Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};
