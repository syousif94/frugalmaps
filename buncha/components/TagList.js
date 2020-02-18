import React, { useRef, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import _ from "lodash";
import * as Events from "../store/events";
import { UPCOMING, NOW } from "../utils/Colors";
import { itemRemaining } from "../utils/Time";
import { usePreventBackScroll } from "../utils/Hooks";
import { ANDROID } from "../utils/Constants";
import { SearchContext, getItemCount, getItemText } from "../utils/Search";

export const TAG_LIST_HEIGHT = 116;

export default ({ style, buttonStyle }) => {
  const scrollRef = useRef(null);
  usePreventBackScroll(scrollRef);
  const [, , list] = useContext(SearchContext);
  return (
    <View style={style}>
      <ScrollView
        ref={scrollRef}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={[
          {
            height: TAG_LIST_HEIGHT,
            padding: 1
          }
        ]}
      >
        <View>
          {makeItems(list, buttonStyle).map((row, index) => {
            return (
              <View style={{ flexDirection: "row", flex: 1 }} key={`${index}`}>
                {row}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const ROWS = 3;

function makeItems(list, buttonStyle) {
  const rows = Array.from({ length: ROWS }, () => []);

  return list.reduce((rows, item, index) => {
    const rowIndex = index % ROWS;
    rows[rowIndex].push(
      <Button item={item} key={`${index}`} style={buttonStyle} />
    );
    return rows;
  }, rows);
}

const Button = ({ item: i, style }) => {
  let item;
  let matches;
  if (i.matches) {
    item = i.item;
    matches = i.matches;
  } else {
    item = i;
  }

  const text = item.type === "tag" ? _.lowerCase(item.text) : item.text;
  const count = getItemCount(item);
  const subtext = getItemText(item);
  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: "center",
          backgroundColor: "rgba(180,180,180,0.1)",
          paddingHorizontal: 6,
          borderRadius: 1,
          margin: 1
        },
        style
      ]}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 13,
          color: "#555",
          fontWeight: ANDROID ? "700" : "600"
        }}
      >
        {text}
        <Text style={{ color: "#777" }}> {count}</Text>
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          marginTop: ANDROID ? -1.5 : null,
          fontSize: 11,
          fontWeight: ANDROID ? "700" : "600",
          color: "#777"
        }}
      >
        {subtext}
      </Text>
    </TouchableOpacity>
  );
};
