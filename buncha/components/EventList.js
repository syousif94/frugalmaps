import React, { useRef } from "react";
import { View, FlatList } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import { useDimensions } from "../utils/Hooks";
import { tabBarHeight } from "./TabBar";
import EventListItem from "./EventListItem";

export default () => {
  const listRef = useRef(null);
  const [dimensions] = useDimensions();
  const data = useSelector(state => state.events.upNext, shallowEqual);
  return (
    <View
      style={{
        position: "absolute",
        bottom: tabBarHeight,
        left: 0,
        right: 0
      }}
    >
      <FlatList
        ref={listRef}
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        keyExtractor={(item, index) => `${item._id}${index}`}
        renderItem={data => {
          return <EventListItem {...data} width={130} />;
        }}
      />
    </View>
  );
};
