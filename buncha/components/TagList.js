import React, { useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard
} from "react-native";
import _ from "lodash";
import { usePreventBackScroll, useEveryMinute } from "../utils/Hooks";
import { ANDROID, WEB } from "../utils/Constants";
import { SearchContext, getItemCount, getItemText } from "../utils/Search";
import { useDispatch } from "react-redux";
import * as Events from "../store/events";

export default ({ horizontal = false }) => {
  const scrollRef = useRef(null);
  usePreventBackScroll(scrollRef);
  const [, setFilter, list] = useContext(SearchContext);
  const contentContainerStyle = {
    padding: 2.5
  };
  if (!horizontal) {
    contentContainerStyle.flexDirection = "row";
    contentContainerStyle.flexWrap = "wrap";
  }
  const buttonStyle = horizontal
    ? null
    : {
        paddingVertical: 5
      };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal={horizontal}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
      >
        {WEB ? (
          <View>
            {makeItems(
              list,
              {
                paddingVertical: 4
              },
              setFilter
            ).map((row, index) => {
              return (
                <View style={{ flexDirection: "row" }} key={`${index}`}>
                  {row}
                </View>
              );
            })}
          </View>
        ) : (
          list.map((item, index) => {
            return (
              <Button
                item={item}
                key={`${index}`}
                style={buttonStyle}
                setFilter={setFilter}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const ROWS = 2;

function makeItems(list, buttonStyle, setFilter) {
  const rows = Array.from({ length: ROWS }, () => []);

  return list.reduce((rows, item, index) => {
    const rowIndex = index % ROWS;
    rows[rowIndex].push(
      <Button
        item={item}
        key={`${index}`}
        style={buttonStyle}
        setFilter={setFilter}
      />
    );
    return rows;
  }, rows);
}

const Button = ({ item: i, style, setFilter }) => {
  const dispatch = useDispatch();

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
  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: "center",
          backgroundColor: "rgba(180,180,180,0.1)",
          paddingHorizontal: 7,
          justifyContent: "center",
          borderRadius: 4,
          margin: 2.5
        },
        style
      ]}
      onPress={() => {
        Keyboard.dismiss();
        switch (item.type) {
          case "tag":
            dispatch(Events.filter({ tag: item.text }));
            setFilter("");
            break;
          default:
            break;
        }
      }}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 15,
          color: "#555",
          fontWeight: ANDROID ? "700" : "600"
        }}
      >
        {text}
        <SubText item={item} />
      </Text>
      <Text
        style={{
          color: "#777",
          marginTop: ANDROID ? -1.5 : -1,
          fontSize: 12,
          fontWeight: ANDROID ? "700" : "600"
        }}
      >
        {count} event{count !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );
};

const SubText = ({ item }) => {
  const [currentTime] = useEveryMinute();
  const info = getItemText(item);
  switch (item.type) {
    case "tag":
      return (
        <Text
          style={{
            color: info.color
          }}
        >
          {" "}
          {info.text}
        </Text>
      );
    default:
      return null;
  }
};
