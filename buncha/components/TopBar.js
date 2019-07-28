import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated
} from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { getInset } from "../utils/SafeAreaInsets";
import { WEB, IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { Entypo } from "@expo/vector-icons";
import { BLUE, RED } from "../utils/Colors";
import SortBar from "./SortBar";

export default ({ toggle, rotate }) => {
  const city = useSelector(state => state.events.city);
  const locationEnabled = useSelector(state => state.permissions.location);
  const count = useSelector(state => state.events.upNext);

  const today = moment();
  const day = today.format("dddd, MMMM D, Y");

  const locationText =
    city && city.text.length
      ? city.text
      : locationEnabled
      ? "Locating"
      : "Everywhere";

  const onPress = useCallback(() => {
    if (WEB) {
      navigate("Menu");
    } else {
      toggle();
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitleText}>{day}</Text>
          <View style={[styles.row, { marginTop: 5 }]}>
            <Text style={styles.titleText}>{locationText}</Text>
            {count.length ? (
              <View style={styles.count}>
                <Text style={styles.countText}>{count.length}</Text>
              </View>
            ) : null}
          </View>
        </View>
        {WEB ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 6
            }}
          >
            <Entypo name="menu" size={18} color={BLUE} />
            <Text
              style={{
                color: BLUE,
                fontSize: 12,
                fontWeight: "600",
                marginLeft: 3,
                marginBottom: 1
              }}
            >
              MENU
            </Text>
          </View>
        ) : (
          <Animated.View
            style={{
              marginRight: 6,
              marginTop: 3,
              transform: [
                {
                  rotate: rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"]
                  })
                }
              ]
            }}
          >
            <Entypo name="chevron-small-down" size={22} color={BLUE} />
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const topInset = getInset("top");

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: WEB ? 500 : null,
    alignSelf: WEB ? "center" : "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    paddingTop: IOS ? topInset : 10,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "center"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600"
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: "600"
  },
  count: {
    height: 16,
    justifyContent: "center",
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: RED,
    marginLeft: 7
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff"
  }
});
