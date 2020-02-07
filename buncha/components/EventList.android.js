import React, { useRef } from "react";
import { View, FlatList } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import UpNextItem, { itemMargin } from "./UpNextItem";
import { useDimensions } from "../utils/Hooks";

export default () => {
  const listRef = useRef(null);
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [dimensions] = useDimensions();
  const widescreen = dimensions.width > 500;
  const wideProps = widescreen
    ? {
        numColumns: 3,
        columnWrapperStyle: {
          width: "33.33%"
        }
      }
    : {};

  const itemWidth = widescreen
    ? (dimensions.width - itemMargin) * 33.33 - itemMargin
    : dimensions.width - itemMargin * 2;

  const paddingTop = widescreen ? itemMargin : 10;
  const data = [];
  return (
    <View style={{ width: dimensions.width }}>
      <FlatList
        ref={listRef}
        nestedScrollEnabled
        scrollEnabled={false}
        data={data}
        contentContainerStyle={{
          paddingTop,
          paddingBottom: insets.bottom,
          paddingHorizontal: itemMargin / 2
        }}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        keyExtractor={(item, index) => `${item._id}${index}`}
        {...wideProps}
        renderItem={data => {
          return (
            <UpNextItem
              {...data}
              style={{
                paddingHorizontal: itemMargin / 2,
                width: "100%",
                height: null
              }}
              listTitle={title}
              width={itemWidth}
            />
          );
        }}
      />
    </View>
  );
};
