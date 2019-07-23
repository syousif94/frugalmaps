import React, { useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { WEB } from "../utils/Constants";
import * as Events from "../store/events";
import { BLUE } from "../utils/Colors";
import { navigate, getHistory } from ".";
import CityOrderPicker from "../components/CityOrderPicker";
import Link from "../components/Link";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { enableLocation } from "../store/permissions";
import * as Cities from "../store/cities";
import CityItem from "../components/CityItem";

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
          <Link
            to="/submit"
            onPress={() => {
              navigate("Submit");
            }}
            style={[styles.navButton, { backgroundColor: "#13BE24" }]}
          >
            <Text style={styles.navButtonText}>Add Events</Text>
          </Link>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cities</Text>
        <CityOrderPicker />
      </View>
      <FlatList
        data={cities}
        style={styles.list}
        renderItem={data => <CityItem {...data} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: WEB ? 500 : null,
    alignSelf: WEB ? "center" : "stretch"
  },
  list: {
    flex: 1
  },
  nav: {
    paddingTop: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
