import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { navigate } from "../screens";
import { BLUE, RED } from "../utils/Colors";
import { FontAwesome, EvilIcons, Feather } from "@expo/vector-icons";
import BlurView from "./BlurView";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ANDROID } from "../utils/Constants";
import TagList, { TAG_LIST_HEIGHT } from "./TagList";
import { getInset } from "../utils/SafeAreaInsets";

let bottomInset = getInset("bottom");
if (bottomInset < 20) {
  bottomInset += 5;
}
const topPadding = 5;
const topBorderWidth = 1;
const buttonHeight = 44;

const tabBarHeight =
  buttonHeight + TAG_LIST_HEIGHT + topBorderWidth + bottomInset;

export { tabBarHeight };

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  const iC = iconColor(routeKey);

  return (
    <BlurView style={styles.container}>
      <View style={styles.content}>
        <TagList contentContainerStyle={{ padding: 2.5 }} />
        <View style={styles.navButtons}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 2.5,
                height: buttonHeight,
                borderRadius: 6,
                backgroundColor: "rgba(180,180,180,0.1)"
              }}
              onPress={() => {}}
            />
          </View>

          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("UpNext");
            }}
          >
            <FontAwesome name="map-o" size={16} color={iC("UpNext")} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: 2, color: iC("UpNext") }]}
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
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Feather name="activity" size={18} color={iC("Account")} />
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonText,
                  { marginTop: 1, color: iC("Account") }
                ]}
              >
                Feed
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{13}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("Submit");
            }}
          >
            <Feather name="plus" size={20} color={iC("Submit")} />
            <Text allowFontScaling={false} style={[styles.buttonText]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    left: 0,
    height: tabBarHeight
  },
  content: {
    flex: 1,
    borderTopWidth: topBorderWidth,
    borderColor: "rgba(0,0,0,0.05)"
  },
  navButtons: {
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: 2.5,
    paddingBottom: bottomInset,
    flexDirection: "row",
    width: "100%"
  },
  roundBtn: {
    height: buttonHeight,
    width: buttonHeight,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 3.5,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5,
    borderRadius: 6
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
    right: -7,
    borderRadius: 5,
    height: 10,
    paddingLeft: 2,
    paddingRight: 2.5,
    justifyContent: "center",
    backgroundColor: RED
  },
  badgeText: {
    marginTop: ANDROID ? null : 0.5,
    fontSize: 6,
    fontWeight: ANDROID ? "700" : "900",
    color: "#fff",
    backgroundColor: "transparent"
  }
});
