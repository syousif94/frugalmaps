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
import { ANDROID } from "../utils/Constants";
import { SearchContext, getItemCount, getItemText } from "../utils/Search";
import { useDispatch } from "react-redux";
import * as Events from "../store/events";

export default ({ style, buttonStyle }) => {
  const scrollRef = useRef(null);
  usePreventBackScroll(scrollRef);
  const [, setFilter, list] = useContext(SearchContext);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          {
            padding: 2.5,
            flexDirection: "row",
            flexWrap: "wrap"
          }
        ]}
      >
        {list.map((item, index) => {
          return (
            <Button
              item={item}
              key={`${index}`}
              style={buttonStyle}
              setFilter={setFilter}
            />
          );
        })}
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
          padding: 6,
          borderRadius: 5,
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
          fontSize: 19,
          color: "#555",
          fontWeight: "600"
        }}
      >
        {text}
        <Text style={{ color: "#777" }}> {count}</Text>
      </Text>
      <SubText item={item} />
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
          allowFontScaling={false}
          style={{
            marginTop: ANDROID ? -1.5 : null,
            fontSize: 15,
            fontWeight: "600",
            color: info.color
          }}
        >
          {info.text}
        </Text>
      );
    default:
      return null;
  }
};
