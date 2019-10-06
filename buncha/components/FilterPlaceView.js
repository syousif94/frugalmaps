import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE } from "../store/filters";
import CityItem from "./CityItem";
import { getInset } from "../utils/SafeAreaInsets";

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
        ListHeaderComponent={() => (
          <Text style={styles.titleText}>{PAGE.WHERE}</Text>
        )}
      />
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
  titleText: {
    marginTop: 12,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
    fontWeight: "700"
  }
});
