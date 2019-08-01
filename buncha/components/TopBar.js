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
import { Entypo, Ionicons } from "@expo/vector-icons";
import { BLUE, RED, NOW } from "../utils/Colors";
import Link from "./Link";

export default ({ toggle, rotate }) => {
  const city = useSelector(state => state.events.city);
  const locationEnabled = useSelector(state => state.permissions.location);
  const count = useSelector(state => state.events.upNext);

  const today = moment();
  const day = today.format("dddd h:mma, MMMM D, Y");

  const locationText =
    city && city.text.length
      ? city.text
      : locationEnabled
      ? "Locating"
      : "Everywhere";

  const onPress = useCallback(() => {
    if (WEB) {
      navigate("Search");
    } else {
      toggle();
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitleText}>{day}</Text>
          <View style={[styles.row, { marginTop: 5 }]}>
            <Text style={styles.titleText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>
        </View>
        {WEB ? (
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <NavLink
              to="/add"
              onPress={() => {
                navigate("Add");
              }}
              text="Add"
            >
              <Ionicons
                style={{ marginTop: 1 }}
                name="ios-add"
                size={28}
                color={NOW}
              />
            </NavLink>
            <NavLink
              to="/search"
              onPress={() => {
                navigate("Search");
              }}
              text="Search"
              style={{ marginHorizontal: 10 }}
            >
              <Ionicons
                style={{ marginTop: 1 }}
                name="ios-search"
                size={20}
                color={BLUE}
              />
            </NavLink>
          </View>
        ) : (
          <View style={styles.row}>
            <Ionicons
              style={{ marginTop: 1 }}
              name="ios-search"
              size={20}
              color={BLUE}
            />
            <Animated.View
              style={{
                marginRight: 10,
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
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const NavLink = ({ children, style = {}, text, ...props }) => {
  return (
    <Link
      {...props}
      style={[
        {
          justifyContent: "center",
          paddingHorizontal: 5,
          alignItems: "center",
          flexDirection: "row",
          height: 36
        },
        style
      ]}
    >
      {children}
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: "#000",
          marginLeft: 6
        }}
      >
        {text}
      </Text>
    </Link>
  );
};

const topInset = getInset("top");

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: WEB ? 500 : null,
    alignSelf: WEB ? "center" : "stretch",
    borderBottomWidth: 1,
    borderBottomColor: WEB ? "#f2f2f2" : "#e0e0e0"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    paddingTop: IOS ? topInset : 10,
    paddingBottom: 7,
    paddingLeft: 10,
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
