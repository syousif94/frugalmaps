import React, { useRef, useContext, memo } from "react";
import EventSearchInput from "./EventSearchInput";
import { View, TouchableOpacity } from "react-native";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import { InputContext } from "./InputContext";
import TagList from "./TagList";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";
import emitter from "tiny-emitter/instance";
import { PAGE } from "../store/filters";

export default memo(() => {
  const inputRef = useRef(null);
  const [searchFocused, setSearchFocused] = useContext(InputContext);
  return (
    <View>
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: itemMargin,
          flexDirection: "row"
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <EventSearchInput
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              overflow: "hidden"
            }}
            ref={inputRef}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
          />
        </View>
        <MenuButton />
      </View>
      <TagList
        style={{
          marginTop: 8
        }}
      />
    </View>
  );
});

const MenuButton = () => {
  return (
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 5,
        backgroundColor: "rgba(180,180,180,0.1)"
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 3
        }}
        onPress={() => {
          requestAnimationFrame(() => {
            emitter.emit("filters", PAGE.WHEN);
          });
        }}
      >
        <Ionicons name="ios-menu" size={26} color={BLUE} />
      </TouchableOpacity>
    </View>
  );
};
