import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import CityOrderPicker from "./CityOrderPicker";
import CityItem from "./CityItem";
import { useSelector } from "react-redux";
import SearchTime from "./SearchTime";
import SearchTags from "./SearchTags";

export default ({ toggle = () => {} }) => {
  const cities = useSelector(state => state.cities[state.cities.list]);
  return (
    <View style={styles.container}>
      <FlatList
        data={cities}
        style={styles.list}
        renderItem={data => <CityItem {...data} toggle={toggle} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListHeaderComponent={() => {
          return (
            <View style={styles.header}>
              <SearchTime />
              <SearchTags />
              <Text style={styles.headerText}>Where</Text>
              <CityOrderPicker />
              <View style={styles.divider} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#f2f2f2"
  }
});
