import React, { useRef, useContext, useEffect } from "react";
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

export default ({ horizontal = false, bottomInset = 0 }) => {
  const scrollRef = useRef(null);
  usePreventBackScroll(scrollRef);
  const [, setFilter, list] = useContext(SearchContext);
  useEffect(() => {
    scrollRef.current.scrollTo({ x: 0, animated: false });
  }, [list]);
  const contentContainerStyle = {
    padding: 2.5
  };
  if (horizontal) {
    contentContainerStyle.paddingBottom = WEB ? 2.5 : 0;
  } else {
    contentContainerStyle.flexDirection = "row";
    contentContainerStyle.flexWrap = "wrap";
    if (ANDROID && bottomInset > 0) {
      contentContainerStyle.paddingBottom = bottomInset;
    }
  }
  const buttonStyle = horizontal
    ? { marginBottom: 0 }
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
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        contentInset={{
          top: 0,
          bottom: bottomInset
        }}
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
          paddingHorizontal: 6,
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
            break;
          case "city":
            dispatch(Events.getCity(item.city));
          default:
            break;
        }
        setFilter("");
      }}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 13,
          color: "#555",
          fontWeight: "700"
        }}
      >
        {text}
        <SubText item={item} />
      </Text>
      <Text
        style={{
          color: "#777",
          marginTop: ANDROID ? -1.5 : null,
          fontSize: 10,
          fontWeight: "700"
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
