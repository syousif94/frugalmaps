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

export default ({ toggle, rotate, style = { paddingLeft: 15 } }) => {
  const city = useSelector(state => state.events.city);
  const locationEnabled = useSelector(state => state.permissions.location);
  const count = useSelector(state => state.events.upNext);

  const today = moment();
  const day = today.format("dddd h:mma");

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
      <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.timeText}>{day}</Text>
          <View style={[styles.row, { marginTop: 5 }]}>
            <Text style={styles.locationText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>
        </View>
        {WEB ? (
          <NavLink
            to="/add"
            onPress={() => {
              navigate("Add");
            }}
            text="Add Fun Stuff"
          >
            <Ionicons
              style={{ marginTop: 1 }}
              name="ios-add"
              size={28}
              color={"#fff"}
            />
          </NavLink>
        ) : null}
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
          paddingHorizontal: 15,
          alignItems: "center",
          flexDirection: "row",
          height: 36,
          backgroundColor: NOW,
          borderRadius: 18
        },
        style
      ]}
    >
      {children}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: "#fff",
          marginLeft: 10
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
    maxWidth: WEB ? 900 : null,
    alignSelf: WEB ? "center" : "stretch",
    borderBottomWidth: WEB ? null : 1,
    borderColor: "#e0e0e0"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    paddingTop: IOS ? topInset : WEB ? 20 : 10,
    paddingBottom: WEB ? 10 : 7,
    flexDirection: "row",
    alignItems: "center"
  },
  timeText: {
    fontSize: 22,
    fontWeight: "700"
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "700"
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
