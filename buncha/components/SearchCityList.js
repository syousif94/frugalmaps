import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import CityOrderPicker from "./CityOrderPicker";
import CityItem from "./CityItem";
import { useSelector } from "react-redux";

export default ({ toggle = () => {} }) => {
  const cities = useSelector(state => state.cities[state.cities.list]);
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Where</Text>
      <CityOrderPicker />
      <View style={styles.divider} />
      <FlatList
        data={cities}
        style={styles.list}
        renderItem={data => <CityItem {...data} toggle={toggle} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "70%",
    backgroundColor: "#fff",
    paddingTop: 10
  },
  headerText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
    marginLeft: 10
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
