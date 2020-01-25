import React, { useRef, memo, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Keyboard
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useSelector, shallowEqual } from "react-redux";
import UpNextItem, { itemMargin, columns } from "./UpNextItem";
import { MarkerMapView as MapView } from "../screens/MapScreen";
import { useDimensions } from "../utils/Hooks";
import { ANDROID } from "../utils/Constants";
import MapEventButton from "./MapEventButton";
import TagList from "./TagList";
import EventListHeader from "./EventListHeader";

export const EXPOSED_LIST = 200;

export default memo(() => {
  let initialOffset = 0;
  const listRef = useRef(null);
  const scrollOffset = useRef(new Animated.Value(initialOffset));
  const headerRef = useRef(<ListHeader scrollOffset={scrollOffset} />);
  const insets = useSafeArea();
  const data = useSelector(state => state.events.upNext, shallowEqual);
  const [dimensions] = useDimensions();
  const [scrollPosition] = useScrollToSearch(listRef);
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={data}
        renderItem={({ item, index }) => {
          return <Text>{item}</Text>;
        }}
        onScroll={Animated.forkEvent(
          Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffset.current } } }],
            { useNativeDriver: true }
          ),
          e => {
            scrollPosition.current = e.nativeEvent.contentOffset.y;
          }
        )}
        ListHeaderComponent={headerRef.current}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          paddingHorizontal: itemMargin / 2,
          minHeight: dimensions.height * 2 - EXPOSED_LIST
        }}
        ListHeaderComponentStyle={{ marginHorizontal: itemMargin / -2 }}
        contentInsetAdjustmentBehavior="never"
        keyExtractor={item => item._id}
        numColumns={columns}
        columnWrapperStyle={{
          width: dimensions.width > 500 ? "25%" : "50%"
        }}
        renderItem={data => {
          return (
            <UpNextItem
              {...data}
              style={{
                paddingHorizontal: itemMargin / 2
              }}
            />
          );
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
});

const ListHeader = ({ scrollOffset }) => {
  const height = Dimensions.get("window").height - EXPOSED_LIST;
  return (
    <View
      style={{
        height,
        overflow: "hidden"
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [
            {
              translateY: scrollOffset.current.interpolate({
                inputRange: [0, height],
                outputRange: [0, height / 2],
                extrapolate: "clamp"
              })
            }
          ]
        }}
      >
        <MapView />
      </Animated.View>
      <EventListHeader scrollOffset={scrollOffset} />
      <MapEventButton scrollOffset={scrollOffset} />
      <View
        style={{
          backgroundColor: "#fff",
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          marginTop: -25,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6
        }}
      >
        <TagList
          style={{
            marginTop: itemMargin
          }}
        />
      </View>
    </View>
  );
};

const KEYBOARD_EVENTS = ANDROID
  ? ["keyboardDidShow", "keyboardDidHide"]
  : ["keyboardWillShow", "keyboardWillHide"];

function useScrollToSearch(listRef) {
  const scrollPosition = useRef(0);

  useEffect(() => {
    const onShow = e => {
      const keyboardHeight = e.endCoordinates.height - EXPOSED_LIST + 11;

      if (scrollPosition.current < keyboardHeight) {
        listRef.current.getNode().scrollToOffset({
          offset: keyboardHeight,
          animated: !ANDROID
        });
      }
    };

    Keyboard.addListener(KEYBOARD_EVENTS[0], onShow);

    return () => {
      Keyboard.removeListener(KEYBOARD_EVENTS[0], onShow);
    };
  }, []);

  return [scrollPosition];
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
