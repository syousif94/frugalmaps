import React, { useRef } from "react";
import { View, Animated, Text } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import { useDimensions } from "../utils/Hooks";
import EventListItem from "./EventListItem";
import MapView from "./MapView";
import BlurView from "./BlurView";
import TagList from "./TagList";
import { useSafeArea } from "react-native-safe-area-context";
import EventSearchInput from "./EventSearchInput";
import MapEventButton from "./MapEventButton";
import PickerButton from "./PickerButton";
import MenuButton from "./MenuButton";
import { SearchProvider } from "../utils/Search";

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
        ListFooterComponent={() => {
          if (!data.length) {
            return null;
          }
          return (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: "#f4f4f4",
                padding: 7,
                marginTop: 7,
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
      <MapEventButton />
    </View>
  );
};

const HeaderView = () => {
  const [dimensions] = useDimensions();
  return (
    <SearchProvider>
      <Animated.View
        style={{
          marginHorizontal: -7,
          height: dimensions.height - 44,
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
              <View
                style={{
                  marginTop: 2,
                  marginHorizontal: 2,
                  flexDirection: "row"
                }}
              >
                <EventSearchInput contentContainerStyle={{ flex: 1 }} />
                <PickerButton />
                <MenuButton />
              </View>
              <TagList />
            </View>
          </BlurView>
        </View>
      </Animated.View>
    </SearchProvider>
  );
};
