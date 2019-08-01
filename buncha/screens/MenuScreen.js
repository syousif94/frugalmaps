import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { WEB } from "../utils/Constants";
import * as Events from "../store/events";
import { BLUE } from "../utils/Colors";
import { navigate, getHistory } from ".";
import Link from "../components/Link";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { enableLocation } from "../store/permissions";
import * as Cities from "../store/cities";
import SearchCityList from "../components/SearchCityList";

const MenuScreen = () => {
  const dispatch = useDispatch();
  const cities = useSelector(state => state.cities[state.cities.list]);
  const locationEnabled = useSelector(state => state.permissions.location);
  useEffect(() => {
    if (locationEnabled === null) {
      return;
    }
    if (!cities.length) {
      dispatch(Cities.get());
    }
  }, [locationEnabled]);

  useEffect(() => {
    dispatch(enableLocation());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link
          to="/"
          onPress={() => {
            const history = getHistory();
            if (history) {
              if (history.length > 2) {
                history.goBack();
              } else {
                navigate("UpNext");
              }
            }
          }}
          style={{ paddingHorizontal: 8 }}
        >
          <Entypo name="chevron-left" size={22} color={BLUE} />
        </Link>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(Events.get());
              if (WEB) {
                navigate("UpNext");
              }
            }}
            style={[styles.navButton, { marginRight: 10 }]}
          >
            <FontAwesome name="location-arrow" size={18} color="#fff" />
            <Text style={[styles.navButtonText, { marginLeft: 8 }]}>
              Current Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SearchCityList />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  nav: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: WEB ? 500 : null,
    alignSelf: WEB ? "center" : "stretch"
  },
  navButton: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 34,
    borderRadius: 38 / 2,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center"
  },
  navButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700"
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerText: {
    fontWeight: "700",
    fontSize: 24,
    color: "#000"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
