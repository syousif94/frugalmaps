import React from "react";
import { Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { BLUE } from "../utils/Colors";
import { Ionicons, FontAwesome, EvilIcons } from "@expo/vector-icons";
import BlurView from "./BlurView";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  TimePicker,
  PlacePicker,
  buttonHeight,
  TagPicker
} from "./PickerButton";

const width = Dimensions.get("window").width;

let bottomInset = IOS ? getInset("bottom") : 0;

if (bottomInset === 0) {
  bottomInset = 5;
} else if (bottomInset > 25) {
  bottomInset -= 10;
}

const topPadding = 5;
const topBorderWidth = 1;

const tabBarHeight = bottomInset + buttonHeight + topPadding + topBorderWidth;

export { tabBarHeight };

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  return (
    <BlurView style={styles.container}>
      <ScrollView
        centerContent={width > 600}
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingHorizontal: 2.5,
          paddingBottom: bottomInset
        }}
        style={{
          borderTopWidth: topBorderWidth,
          borderColor: "rgba(0,0,0,0.05)"
        }}
        horizontal
        alwaysBounceHorizontal
        showsHorizontalScrollIndicator={false}
      >
        {routeKey === "UpNext" ? null : (
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("UpNext");
            }}
          >
            <EvilIcons name="calendar" size={28} color={BLUE} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: -3 }]}
            >
              List
            </Text>
          </TouchableOpacity>
        )}

        {routeKey === "Map" ? null : (
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("Map");
            }}
          >
            <FontAwesome name="map-o" size={16} color={BLUE} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: 3 }]}
            >
              Map
            </Text>
          </TouchableOpacity>
        )}

        {routeKey === "Account" ? null : (
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("Account");
            }}
          >
            <FontAwesome name="user-o" size={16} color={BLUE} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: 3 }]}
            >
              Friends
            </Text>
          </TouchableOpacity>
        )}

        <TagPicker />

        <TimePicker />

        <PlacePicker />

        <TouchableOpacity
          style={styles.roundBtn}
          onPress={() => {
            navigate("Submit");
          }}
        >
          <Ionicons name="ios-add-circle-outline" size={18} color={BLUE} />
          <Text allowFontScaling={false} style={styles.buttonText}>
            Add
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0
  },
  roundBtn: {
    height: buttonHeight,
    minWidth: buttonHeight,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
    borderRadius: 6,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5
  },
  selected: {
    color: BLUE
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  }
});
