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

  let numColumns = 3;
  if (dimensions.width > 850) {
    numColumns = 6;
  } else if (dimensions.width > 550) {
    numColumns = 5;
  }

  const itemWidth = (dimensions.width - 12) / numColumns;

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Animated.FlatList
        key={`${numColumns}`}
        ref={listRef}
        numColumns={numColumns}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={headerView.current}
        contentContainerStyle={{
          paddingHorizontal: 6,
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
        ListFooterComponent={() => {
          if (!data.length) {
            return null;
          }
          return (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: "#f4f4f4",
                padding: 6,
                marginTop: 6,
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
          marginHorizontal: -6,
          height: dimensions.height - 44,
          paddingBottom: 6
        }}
      >
        <MapView />
        <View
          style={{
            position: "absolute",
            bottom: 6,
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
