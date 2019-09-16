import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { BLUE } from "../utils/Colors";
import { Ionicons, FontAwesome, EvilIcons, Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const width = Dimensions.get("window").width;

// const routeMap = {
//   Events: "UpNext",
//   Map: "Map",
//   Account: "Account",
//   Submit: "Submit"
// };

let bottomInset = getInset("bottom");

if (bottomInset > 25) {
  bottomInset -= 10;
}

const PickerIcon = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginRight: 8,
        marginLeft: 3
      }}
    >
      <Entypo name="chevron-up" size={10} color={BLUE} />
      <Entypo
        name="chevron-down"
        size={10}
        color={BLUE}
        style={{ marginTop: -1 }}
      />
    </View>
  );
};

const PickerButton = ({ title, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.pickerBtn}>
      <View style={styles.pickerInfo}>
        <Text allowFontScaling={false} style={styles.pickerTitleText}>
          {title}
        </Text>
        <Text allowFontScaling={false} style={styles.pickerValueText}>
          {value}
        </Text>
      </View>
      <PickerIcon />
    </TouchableOpacity>
  );
};

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  return (
    <BlurView style={styles.container} intensity={100} tint="light">
      <ScrollView
        centerContent={width > 600}
        contentContainerStyle={{
          paddingTop: 5,
          paddingHorizontal: 2.5,
          paddingBottom: IOS ? bottomInset : 5
        }}
        style={{
          borderTopWidth: 1,
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

        <PickerButton title="Type" value="All" />

        <PickerButton title="When" value="Tue 7:48pm" />

        <PickerButton title="Where" value="Austin" />

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
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5,
    borderRadius: 6
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerInfo: {
    paddingHorizontal: 8,
    justifyContent: "space-between",
    height: 44,
    paddingVertical: 5
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
