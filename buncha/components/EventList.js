import React, { useRef, useCallback, useEffect } from "react";
import { View, FlatList, Text, Keyboard } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import { useDimensions } from "../utils/Hooks";
import EventListItem, { PADDING } from "./EventListItem";
import MapView from "./MapView";
import BlurView from "./BlurView";
import TagList from "./TagList";
import { useSafeArea } from "react-native-safe-area-context";
import EventSearchInput from "./EventSearchInput";
import MapEventButton from "./MapEventButton";
import PickerButton from "./PickerButton";
import MenuButton from "./MenuButton";
import { SearchProvider } from "../utils/Search";
import { ANDROID } from "../utils/Constants";
import BottomPanel from "./BottomPanel";

export default () => {
  const headerView = useRef(<HeaderView />);
  const listRef = useRef(null);
  const [dimensions] = useDimensions();
  const insets = useSafeArea();
  const data = useSelector(state => state.events.upNext, shallowEqual);
  const [setScrollOffset] = useScrollAboveKeyboard(listRef);

  let numColumns = 1;
  if (dimensions.width > 550) {
    numColumns = 5;
  }

  const itemWidth = (dimensions.width - PADDING * 2) / numColumns;

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <FlatList
        scrollEventThrottle={16}
        onScroll={e => {
          setScrollOffset(e.nativeEvent.contentOffset.y);
        }}
        key={`${numColumns}`}
        ref={listRef}
        numColumns={numColumns}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={headerView.current}
        contentContainerStyle={{
          paddingHorizontal: PADDING,
          paddingBottom: insets.bottom
        }}
        data={data}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        keyExtractor={(item, index) => `${item._id}${index}`}
        renderItem={data => {
          return <EventListItem {...data} width={itemWidth} />;
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: "#f4f4f4",
              marginLeft: PADDING,
              marginRight: -PADDING
            }}
          />
        )}
        ListFooterComponent={() => {
          if (!data.length) {
            return null;
          }
          return (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: "#f4f4f4",
                padding: PADDING,
                marginTop: PADDING,
                height: 120
              }}
            >
              <Text style={{ color: "#ccc", fontSize: 12, fontWeight: "600" }}>
                The End
              </Text>
            </View>
          );
        }}
      />
      <BottomPanel />
      <MapEventButton />
    </View>
  );
};

const KEYBOARD_EVENTS = ANDROID
  ? ["keyboardDidShow", "keyboardDidHide"]
  : ["keyboardWillShow", "keyboardWillHide"];

const OFFSET = ANDROID ? 24 : 50;

function useScrollAboveKeyboard(listRef) {
  const scrollOffset = useRef(0);

  const setScrollOffset = useCallback(offset => {
    scrollOffset.current = offset;
  });

  useEffect(() => {
    const onShow = e => {
      if (scrollOffset.current < e.endCoordinates.height - OFFSET) {
        listRef.current.scrollToOffset({
          offset: e.endCoordinates.height - OFFSET
        });
      }
    };

    Keyboard.addListener(KEYBOARD_EVENTS[0], onShow);

    return () => {
      Keyboard.removeListener(KEYBOARD_EVENTS[0], onShow);
    };
  }, []);

  return [setScrollOffset];
}

const HeaderView = () => {
  const [dimensions] = useDimensions();
  return (
    <SearchProvider>
      <View
        style={{
          marginHorizontal: -PADDING,
          height: dimensions.height - 170,
          overflow: "hidden"
        }}
      >
        <MapView />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            backgroundColor: "#fff",
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            elevation: 7
          }}
        />
      </View>
    </SearchProvider>
  );
};
