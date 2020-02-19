import React, { useRef } from "react";
import { View, ScrollView } from "react-native";
import { useDimensions } from "../utils/Hooks";
import MapView from "./MapView";
import { useSelector, shallowEqual } from "react-redux";
import EventListItem, { PADDING } from "./EventListItem";
import BlurView from "./BlurView";
import EventSearchInput from "./EventSearchInput";
import TagList from "./TagList";
import PickerButton from "./PickerButton";
import MenuButton from "./MenuButton";
import { SearchProvider } from "../utils/Search";
import ListError from "./ListError";

export default () => {
  const [dimensions] = useDimensions();

  const Header = useRef(<HeaderView />);
  const Map = useRef(<MapView />);

  const data = useSelector(state => state.events.upNext, shallowEqual);

  if (dimensions.width > 850) {
    const itemWidth = (400 - 14) / 3;
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {Map.current}
        <View style={{ width: 400 }}>
          <ScrollView>
            {Header.current}
            <ListError />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                padding: PADDING
              }}
            >
              {data.map((item, index) => {
                return (
                  <EventListItem
                    item={item}
                    index={index}
                    width={itemWidth}
                    key={item._id}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  const perRow = dimensions.width < 550 ? 3 : 4;
  const itemWidth = (dimensions.width - 14) / perRow;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ height: dimensions.height - 44, zIndex: 999 }}>
          {Map.current}
          {Header.current}
        </View>
        <ListError />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            padding: PADDING
          }}
        >
          {data.map((item, index) => {
            return (
              <EventListItem
                item={item}
                index={index}
                width={itemWidth}
                key={item._id}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export const HeaderView = () => {
  const [dimensions] = useDimensions();
  const style =
    dimensions.width > 850
      ? null
      : {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0
        };
  return (
    <SearchProvider>
      <View style={[style, , { zIndex: 999 }]}>
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
                flexDirection: "row",
                marginTop: 2,
                marginLeft: 2,
                zIndex: 999
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
    </SearchProvider>
  );
};
