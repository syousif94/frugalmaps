import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE } from "../store/filters";
import CityItem from "./CityItem";
import { getInset } from "../utils/SafeAreaInsets";
import { BLUE } from "../utils/Colors";
import * as Events from "../store/events";
import { FontAwesome } from "@expo/vector-icons";
import CityOrderPicker from "./CityOrderPicker";

export default () => {
  const cities = useSelector(state => state.cities[state.cities.list]);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={cities}
        style={styles.list}
        renderItem={data => <CityItem {...data} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListHeaderComponent={() => <HeaderView cities={cities} />}
      />
    </View>
  );
};

const HeaderView = ({ cities }) => {
  const dispatch = useDispatch();

  const countText = cities.length
    ? `${cities.length} cit${cities.length !== 1 ? "ies" : "y"}`
    : "Loading..";
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleText}>{PAGE.WHERE}</Text>
          <Text style={styles.subText}>{countText}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            dispatch(Events.refresh(null, true));
          }}
          style={styles.navButton}
        >
          <FontAwesome name="location-arrow" size={18} color="#fff" />
          <Text style={[styles.navButtonText, { marginLeft: 8 }]}>
            Current Location
          </Text>
        </TouchableOpacity>
      </View>
      <CityOrderPicker />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    marginLeft: 10,
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingBottom: getInset("bottom") + 15
  },
  header: {
    marginLeft: 10,
    paddingRight: 10,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)"
  },
  titleText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700"
  },
  subText: {
    marginTop: 1,
    fontSize: 14,
    color: "#777",
    fontWeight: "500"
  },
  navButton: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center"
  },
  navButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700"
  }
});
