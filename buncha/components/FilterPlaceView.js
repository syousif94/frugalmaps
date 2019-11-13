import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { PAGE } from "../store/filters";
import CityItem from "./CityItem";
import { getInset } from "../utils/SafeAreaInsets";
import { BLUE } from "../utils/Colors";
import * as Events from "../store/events";
import { FontAwesome } from "@expo/vector-icons";
import CityOrderPicker from "./CityOrderPicker";
import SegmentedControl from "./SegmentedControl";
import { WEB } from "../utils/Constants";
import emitter from "tiny-emitter/instance";

export default ({ page }) => {
  const cities = useSelector(
    state => state.cities[state.cities.list],
    shallowEqual
  );

  const isPage = page === PAGE.WHERE;
  const pointerEvents = isPage ? "auto" : "none";
  return (
    <View
      pointerEvents={pointerEvents}
      style={[
        styles.container,
        {
          opacity: isPage ? 1 : 0
        }
      ]}
    >
      <FlatList
        contentContainerStyle={styles.content}
        data={cities}
        style={styles.list}
        renderItem={data => <CityItem {...data} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListHeaderComponent={() => <HeaderView cities={cities} page={page} />}
      />
    </View>
  );
};

const ListPicker = ({ page }) => {
  if (WEB) {
    return null;
  }

  return (
    <SegmentedControl
      options={[PAGE.WHEN, PAGE.WHERE]}
      selected={page}
      containerStyle={{
        width: null,
        marginTop: 10
      }}
      onPress={option => {
        emitter.emit("filters", option);
      }}
    />
  );
};

const HeaderView = ({ cities, page }) => {
  const dispatch = useDispatch();

  const countText = cities.length
    ? `${cities.length} cit${cities.length !== 1 ? "ies" : "y"}`
    : "Loading..";
  return (
    <View style={styles.header}>
      <ListPicker page={page} />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
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
    ...StyleSheet.absoluteFillObject
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
