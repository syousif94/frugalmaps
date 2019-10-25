import React from "react";
import { Text, StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { BLUE, RED } from "../utils/Colors";
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

  const iC = iconColor(routeKey);

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
        <TouchableOpacity
          style={[
            styles.roundBtn,
            {
              marginLeft: 2.5,
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6
            }
          ]}
          onPress={() => {
            navigate("UpNext");
          }}
        >
          <EvilIcons name="calendar" size={28} color={iC("UpNext")} />
          <Text
            allowFontScaling={false}
            style={[styles.buttonText, { marginTop: -3 }]}
          >
            List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundBtn}
          onPress={() => {
            navigate("Map");
          }}
        >
          <FontAwesome name="map-o" size={16} color={iC("Map")} />
          <Text
            allowFontScaling={false}
            style={[styles.buttonText, { marginTop: 3 }]}
          >
            Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundBtn}
          onPress={() => {
            navigate("Account");
          }}
        >
          <FontAwesome name="user-o" size={16} color={iC("Account")} />
          <Text
            allowFontScaling={false}
            style={[styles.buttonText, { marginTop: 3 }]}
          >
            Feed
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{13}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roundBtn,
            {
              marginRight: 2.5,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6
            }
          ]}
          onPress={() => {
            navigate("Submit");
          }}
        >
          <Ionicons
            name="ios-add-circle-outline"
            size={18}
            color={iC("Submit")}
          />
          <Text allowFontScaling={false} style={styles.buttonText}>
            Add
          </Text>
        </TouchableOpacity>

        <TagPicker
          style={{
            marginLeft: 2.5,
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6
          }}
        />

        <TimePicker />

        <PlacePicker
          style={{
            marginRight: 2.5,
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6
          }}
        />
      </ScrollView>
    </BlurView>
  );
};

function iconColor(routeKey) {
  return function(routeName) {
    return routeName === routeKey ? BLUE : "#777";
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0
  },
  roundBtn: {
    height: buttonHeight,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 0.5
  },
  selected: {
    color: BLUE
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    borderRadius: 5,
    height: 10,
    paddingHorizontal: 2,
    justifyContent: "center",
    backgroundColor: RED
  },
  badgeText: {
    marginTop: 0.5,
    fontSize: 6,
    fontWeight: "900",
    color: "#fff",
    backgroundColor: "transparent"
  }
});
