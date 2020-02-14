import React, { useRef } from "react";
import { View, Animated } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import { useDimensions } from "../utils/Hooks";
import EventListItem from "./EventListItem";
import MapView from "./MapView";
import BlurView from "./BlurView";
import TagList, { TAG_LIST_HEIGHT } from "./TagList";
import { useSafeArea } from "react-native-safe-area-context";
import EventSearchInput from "./EventSearchInput";
import MapEventButton from "./MapEventButton";

export default () => {
  const headerView = useRef(<HeaderView />);
  const listRef = useRef(null);
  const [dimensions] = useDimensions();
  const insets = useSafeArea();
  const data = useSelector(state => state.events.upNext, shallowEqual);
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Animated.FlatList
        ref={listRef}
        numColumns={3}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={headerView.current}
        contentContainerStyle={{
          paddingHorizontal: 7,
          paddingBottom: insets.bottom
        }}
        data={data}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        keyExtractor={(item, index) => `${item._id}${index}`}
        renderItem={data => {
          return (
            <EventListItem {...data} width={(dimensions.width - 14) / 3} />
          );
        }}
      />
      <MapEventButton />
    </View>
  );
};

const HeaderView = () => {
  const [dimensions] = useDimensions();
  const insets = useSafeArea();
  return (
    <Animated.View
      style={{
        marginHorizontal: -7,
        height: dimensions.height - insets.bottom,
        paddingBottom: 7
      }}
    >
      <MapView />
      <View
        style={{
          position: "absolute",
          bottom: 7,
          left: 0,
          right: 0
        }}
      >
        <BlurView>
          <View
            style={{
              borderColor: "rgba(0,0,0,0.05)",
              borderTopWidth: 1,
              borderBottomWidth: 1
            }}
          >
            <EventSearchInput
              contentContainerStyle={{ marginTop: 2, marginHorizontal: 2 }}
            />

            <TagList />
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
};
