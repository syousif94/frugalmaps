import React from "react";
import { View, ScrollView, Text } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import CityItem from "./CityItem";

export default () => {
  const cities = useSelector(
    state => state.cities[state.cities.list],
    shallowEqual
  );

  const rows = cities.reduce(
    (row, city, index) => {
      row[index % 3].push({ index, item: city });
      return row;
    },
    [[], [], []]
  );

  return (
    <View>
      <CityButton />
      <ScrollView horizontal>
        <View style={{ padding: 2 }}>
          {rows.map((row, index) => {
            return (
              <View key={`${index}`} style={{ flexDirection: "row" }}>
                {row.map((data, index) => (
                  <CityItem key={`${index}`} {...data} />
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const CityButton = () => {
  const value = useSelector(state => {
    const city = state.events.city;
    const locationEnabled = state.permissions.location;
    const locationText =
      city && city.text.length
        ? city.text.split(",")[0]
        : locationEnabled || locationEnabled === null
        ? "Locating"
        : "Everywhere";
    return locationText;
  });

  return (
    <View>
      <Text>{value}</Text>
    </View>
  );
};
