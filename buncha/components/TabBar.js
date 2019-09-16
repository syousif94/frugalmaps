import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { BLUE } from "../utils/Colors";
import { Ionicons, FontAwesome, EvilIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const routeMap = {
  Events: "UpNext",
  Map: "Map",
  Account: "Account",
  Submit: "Submit"
};

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  return (
    <BlurView style={styles.container} intensity={100} tint="light">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 5,
          paddingHorizontal: 2.5,
          paddingBottom: IOS ? getInset("bottom") - 10 : 5
        }}
        style={{
          borderTopWidth: 1,
          borderColor: "rgba(0,0,0,0.05)"
        }}
        horizontal
        alwaysBounceHorizontal
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.roundBtn}
          onPress={() => {
            if (routeKey === "Map") {
              navigate("UpNext");
            } else {
              navigate("Map");
            }
          }}
        >
          {/* <EvilIcons name="calendar" size={30} color={color} /> */}
          <FontAwesome name="map-o" size={16} color={BLUE} />
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
          <FontAwesome name="user-o" size={16} color={BLUE} />
          <Text
            allowFontScaling={false}
            style={[styles.buttonText, { marginTop: 3 }]}
          >
            Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerBtn}>
          <Text allowFontScaling={false} style={styles.pickerTitleText}>
            Type
          </Text>
          <Text allowFontScaling={false} style={styles.pickerValueText}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerBtn}>
          <Text allowFontScaling={false} style={styles.pickerTitleText}>
            When
          </Text>
          <Text allowFontScaling={false} style={styles.pickerValueText}>
            Tue 7:48pm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerBtn}>
          <Text allowFontScaling={false} style={styles.pickerTitleText}>
            Where
          </Text>
          <Text allowFontScaling={false} style={styles.pickerValueText}>
            Austin
          </Text>
        </TouchableOpacity>

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
    // backgroundColor: "rgba(255,255,255,0.95)",
    // borderTopWidth: 1,
    // borderColor: "rgba(0,0,0,0.05)"
  },
  roundBtn: {
    height: 44,
    minWidth: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
    borderRadius: 6,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5
  },
  pickerBtn: {
    paddingVertical: 5,
    justifyContent: "space-between",
    height: 44,
    backgroundColor: "rgba(180,180,180,0.1)",
    paddingHorizontal: 8,
    marginHorizontal: 2.5,
    borderRadius: 6
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerTitleText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerValueText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000"
  },
  selected: {
    color: BLUE
  }
});
