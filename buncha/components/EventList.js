import React, { useRef } from "react";
import { View, FlatList, Text, Animated } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import { useDimensions } from "../utils/Hooks";
import EventListItem, { PADDING } from "./EventListItem";
import MapView from "./MapView";
import { useSafeArea } from "react-native-safe-area-context";
import MapEventButton from "./MapEventButton";
import { SearchProvider } from "../utils/Search";
import BottomPanel from "./BottomPanel";

export default () => {
  const animatedScrollOffset = useRef(new Animated.Value(0));

  const headerView = useRef(<HeaderView scrollOffset={animatedScrollOffset} />);
  const listRef = useRef(null);
  const [dimensions] = useDimensions();
  const insets = useSafeArea();
  const data = useSelector(state => state.events.upNext, shallowEqual);

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
      <Animated.FlatList
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: animatedScrollOffset.current
              }
            }
          }
        ])}
        scrollEventThrottle={1}
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

const HeaderView = ({ scrollOffset }) => {
  const [dimensions] = useDimensions();
  const mapHeight = dimensions.height - 170;
  return (
    <SearchProvider>
      <View
        style={{
          marginHorizontal: -PADDING,
          height: mapHeight,
          overflow: "hidden"
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                translateY: scrollOffset.current.interpolate({
                  inputRange: [0, dimensions.height],
                  outputRange: [0, dimensions.height],
                  extrapolate: "clamp"
                })
              }
            ]
          }}
        >
          <MapView />
        </Animated.View>
        <HeaderContextView />
      </View>
    </SearchProvider>
  );
};

const HeaderContextView = () => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: "#fff",
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 2
      }}
    >
      <Text
        allowFontScaling={false}
        style={{ fontSize: 14, color: "#777", fontWeight: "600" }}
      >
        All Events
      </Text>
    </View>
  );
};
