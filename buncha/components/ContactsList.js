import React, { useRef, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { useContacts } from "../utils/Contacts";
import Input from "./Input";
import { BLUE } from "../utils/Colors";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { getInset } from "../utils/SafeAreaInsets";
import { HEIGHT } from "../utils/Constants";

const SEARCHBAR_HEIGHT = 46 + 16 + 1;
const ROW_HEIGHT = 50;
const SEPARATOR_HEIGHT = 1;

export default () => {
  const listRef = useRef(null);
  const [contacts, filter, setFilter] = useContacts();
  const [selected, setSelected] = useState(new Set());
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: getInset("top") + 15,
          paddingHorizontal: 30
        }}
      >
        <Text style={{ fontSize: 18, color: "#555" }}>
          Only contacts you pick can see what you're interested in.
        </Text>
      </View>
      <View
        style={{
          height: SEARCHBAR_HEIGHT,
          marginHorizontal: 20,
          backgroundColor: "#fff",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderColor: "#f4f4f4"
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
      <FlatList
        data={contacts}
        style={{ flex: 1 }}
        ref={listRef}
        keyExtractor={item => (item.matches ? item.item.id : item.id)}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: SEPARATOR_HEIGHT,
              backgroundColor: "#f4f4f4",
              marginHorizontal: 30
            }}
          />
        )}
        getItemLayout={(data, index) => {
          return {
            length: ROW_HEIGHT,
            offset: index * (ROW_HEIGHT + SEPARATOR_HEIGHT),
            index
          };
        }}
        renderItem={data => (
          <ItemView {...data} selected={selected} setSelected={setSelected} />
        )}
      />
      <SubmitButton />
    </View>
  );
};

const SubmitButton = () => {
  return (
    <View
      style={{
        height: 60,
        width: 60,
        borderRadius: 30,
        position: "absolute",
        bottom: getInset("bottom") + 15,
        right: 20,
        backgroundColor: "#f4f4f4"
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <FontAwesome name="check" color={BLUE} size={26} />
        <Text
          allowFontScaling={false}
          style={{
            position: "absolute",
            alignSelf: "center",
            bottom: -15,
            fontSize: 9,
            color: BLUE,
            fontWeight: "700"
          }}
        >
          Done
        </Text>
      </TouchableOpacity>
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
        paddingLeft: 20,
        paddingRight: 30,
        height: ROW_HEIGHT,
        flexDirection: "row",
        alignItems: "center"
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
      <Entypo
        style={{ marginTop: 1, marginRight: 6 }}
        name="plus"
        color={isSelected ? BLUE : "#ddd"}
        size={26}
      />
      <NameText />
    </TouchableOpacity>
  );
};
