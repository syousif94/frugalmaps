import React, { useRef, useEffect, useState } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { useContacts } from "../utils/Contacts";
import Input from "./Input";
import { BLUE } from "../utils/Colors";
import { Entypo } from "@expo/vector-icons";
import ProfileView from "./ProfileView";

const SEARCHBAR_HEIGHT = 46 + 16 + 2;
const ROW_HEIGHT = 50;
const SEPARATOR_HEIGHT = 1;

export default ({ bottomOffset }) => {
  const headerHeight = Dimensions.get("window").height * 0.8;
  const listRef = useRef(null);
  const [contacts, filter, setFilter] = useContacts();
  const [selected, setSelected] = useState(new Set());
  const data = [
    {
      data: contacts
    }
  ];
  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={data}
        style={{ flex: 1 }}
        ref={listRef}
        keyExtractor={item => (item.matches ? item.item.id : item.id)}
        render
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: SEPARATOR_HEIGHT,
              backgroundColor: "#f4f4f4",
              marginLeft: 8
            }}
          />
        )}
        getItemLayout={(data, index) => {
          if (!index) {
            return {
              length: SEARCHBAR_HEIGHT,
              offset: headerHeight,
              index
            };
          }
          return {
            length: ROW_HEIGHT,
            offset:
              headerHeight +
              SEARCHBAR_HEIGHT +
              (index - 1) * (ROW_HEIGHT + SEPARATOR_HEIGHT),
            index
          };
        }}
        ListHeaderComponent={() => {
          return <ProfileView />;
        }}
        renderItem={data => (
          <ItemView {...data} selected={selected} setSelected={setSelected} />
        )}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              height: SEARCHBAR_HEIGHT,
              paddingHorizontal: 8,
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#f4f4f4",
              justifyContent: "center"
            }}
          >
            <Input
              placeholder="Search contacts"
              value={filter}
              onChangeText={text => {
                setFilter(text);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const ItemView = ({ item, index, selected, setSelected }) => {
  let matches;
  if (item.matches) {
    matches = item.matches;
    item = item.item;
  }

  let NameText;
  if (matches) {
    const indices = matches
      .map(match => match.indices)
      .reduce((acc, cur) => {
        return [...acc, ...cur];
      }, [])
      .reduce((acc, cur, index, arr) => {
        const startIndex = cur[0];
        const endIndex = cur[1] + 1;

        const prevIndex = acc.length - 1;

        let prevText = prevIndex >= 0 ? acc[prevIndex] : null;

        if (prevText && prevText.highlight) {
          acc.push({
            text: item.name.substring(prevText.endIndex, startIndex),
            highlight: false,
            endIndex: startIndex
          });
        } else if (startIndex && !prevText) {
          acc.push({
            text: item.name.substring(0, startIndex),
            highlight: false,
            endIndex: startIndex
          });
        }

        acc.push({
          text: item.name.substring(startIndex, endIndex),
          highlight: true,
          endIndex: endIndex
        });

        if (index == arr.length - 1 && endIndex < item.name.length) {
          acc.push({
            text: item.name.substring(endIndex),
            highlight: false,
            endIndex: item.name.length
          });
        }

        return acc;
      }, []);

    NameText = () => (
      <Text
        style={{ fontWeight: "700", fontSize: 18 }}
        allowFontScaling={false}
      >
        {indices.map((val, index) => {
          return (
            <Text
              key={val.text + index}
              style={{ backgroundColor: val.highlight ? "yellow" : null }}
            >
              {val.text}
            </Text>
          );
        })}
      </Text>
    );
  } else {
    NameText = () => (
      <Text
        allowFontScaling={false}
        style={{ fontWeight: "700", fontSize: 18 }}
      >
        {item.name}
      </Text>
    );
  }

  const isSelected = selected.has(item.id);

  return (
    <TouchableOpacity
      style={{
        paddingLeft: 15,
        paddingRight: 13,
        height: ROW_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}
      onPress={() => {
        if (isSelected) {
          selected.delete(item.id);
        } else {
          selected.add(item.id);
        }
        setSelected(new Set(selected));
      }}
    >
      <NameText />
      <Entypo
        style={{ marginTop: 1 }}
        name="plus"
        color={isSelected ? BLUE : "#ddd"}
        size={26}
      />
    </TouchableOpacity>
  );
};
