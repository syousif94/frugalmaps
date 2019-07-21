import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { BLUE } from "../utils/Colors";
import moment from "moment";
import { Ionicons, FontAwesome, EvilIcons } from "@expo/vector-icons";

const routeMap = {
  Events: "UpNext",
  Map: "Map",
  Account: "Account",
  Submit: "Submit"
};

const Button = ({ text, style, routeKey, render }) => {
  const onPress = () => {
    navigate(routeMap[text]);
  };
  const textStyle = [styles.buttonText];

  const selected = routeKey === routeMap[text];

  if (selected) {
    textStyle.push(styles.selected);
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {render ? render(selected) : null}
      {text ? (
        <Text allowFontScaling={false} style={textStyle}>
          {text}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  const today = moment().format("MMM D");

  return (
    <View style={styles.container}>
      <Button
        text="Events"
        routeKey={routeKey}
        render={selected => {
          const color = selected ? BLUE : "#aaa";
          return (
            <View style={{ marginBottom: -2 }}>
              <EvilIcons name="calendar" size={30} color={color} />
            </View>
          );
        }}
      />
      <Button
        text="Map"
        routeKey={routeKey}
        render={selected => {
          const color = selected ? BLUE : "#aaa";
          return (
            <View style={{ marginBottom: 4 }}>
              <FontAwesome name="map-o" size={18} color={color} />
            </View>
          );
        }}
      />
      <Button
        text="Account"
        routeKey={routeKey}
        render={selected => {
          const color = selected ? BLUE : "#aaa";
          return (
            <View style={{ marginBottom: 4 }}>
              <FontAwesome name="user-o" size={18} color={color} />
            </View>
          );
        }}
      />
      <Button
        text="Submit"
        routeKey={routeKey}
        render={selected => {
          const color = selected ? BLUE : "#aaa";
          return (
            <View>
              <Ionicons name="ios-add-circle-outline" size={22} color={color} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: IOS ? getInset("bottom") - 10 : 0,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flexDirection: "row"
  },
  button: {
    height: 48,
    paddingBottom: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  selected: {
    color: BLUE
  }
});
