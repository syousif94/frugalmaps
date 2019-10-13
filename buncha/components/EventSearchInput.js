import React, { useState, useRef, useEffect } from "react";
import Input from "./Input";
import { StyleSheet, View, ActivityIndicator, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB, WIDTH, IOS_WEB } from "../utils/Constants";
import { buttonHeight } from "./PickerButton";

export default ({ width }) => {
  const animation = useRef(new Animated.Value(0));
  const focused = useRef(false);

  const narrow = width < 500;

  useEffect(() => {
    if (!focused.current && width < 500) {
      Animated.timing(
        animation.current,
        { toValue: 0, duration: 0 },
        { useNativeDriver: true }
      ).start();
    }
  }, [width, focused]);

  const onFocus = () => {
    focused.current = true;
    Animated.timing(
      animation.current,
      { toValue: 1, duration: 150 },
      { useNativeDriver: true }
    ).start();
  };

  const onBlur = () => {
    focused.current = false;
    Animated.timing(
      animation.current,
      { toValue: 0, duration: 150 },
      { useNativeDriver: true }
    ).start();
  };

  const [query, setQuery] = useState("");

  let containerStyle;
  if (narrow) {
    containerStyle = {
      position: "absolute",
      top: 0,
      right: 5,
      left: 5,
      bottom: 0,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center"
    };
  } else {
    containerStyle = {
      flex: 1,
      marginHorizontal: 2.5
    };
  }

  let sliderStyle;
  if (narrow) {
    const percent = ((width - 10 - 38.5) / (width - 10)) * 100;
    sliderStyle = {
      flex: 1,
      flexDirection: "row",
      transform: [
        {
          translateX: animation.current.interpolate({
            inputRange: [0, 1],
            outputRange: [`${percent}%`, "0%"]
          })
        }
      ]
    };
  } else {
    sliderStyle = {
      flex: 1,
      flexDirection: "row"
    };
  }

  return (
    <View style={containerStyle} pointerEvents="box-none">
      <View
        style={{
          height: buttonHeight,
          overflow: "hidden",
          flexDirection: "row",
          flex: 1,
          borderRadius: 6
        }}
        pointerEvents="box-none"
      >
        <Animated.View style={sliderStyle} pointerEvents="box-none">
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            autoCorrect={WEB ? "false" : false}
            autoCompleteType="off"
            spellCheck={WEB ? "false" : false}
            autoCapitalize="words"
            backgroundColor="rgba(180,180,180,0.1)"
            containerStyle={{ flex: 1, borderRadius: 6 }}
            style={{
              paddingLeft: 0,
              height: buttonHeight - 4,
              marginTop: IOS_WEB ? -1 : null
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            render={() => (
              <View style={styles.icon}>
                <Ionicons name="ios-search" size={18} color={"#666"} />
              </View>
            )}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: "center",
    width: 35,
    paddingLeft: 5,
    alignItems: "center"
  }
});
