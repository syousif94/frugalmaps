import React, { useEffect, useRef } from "react";
import { View, Animated, Keyboard } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useDimensions } from "../utils/Hooks";
import BlurView from "./BlurView";
import EventSearchInput from "./EventSearchInput";
import PickerButton from "./PickerButton";
import MenuButton from "./MenuButton";
import TagList, { TAG_LIST_HEIGHT } from "./TagList";
import { SearchProvider } from "../utils/Search";
import { ANDROID } from "../utils/Constants";

export default () => {
  const insets = useSafeArea();
  const [dimensions] = useDimensions();
  return (
    <SearchProvider>
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <BlurView>
          <View
            style={{
              margin: 2,
              marginRight: 0,
              paddingBottom: insets.bottom,
              flexDirection: "row"
            }}
          >
            <EventSearchInput contentContainerStyle={{ flex: 1 }} />
            <PickerButton />
            <MenuButton />
          </View>
        </BlurView>
      </Animated.View>
    </SearchProvider>
  );
};
