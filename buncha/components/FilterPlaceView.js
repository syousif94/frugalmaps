import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import CityItem, { itemHeight } from "./CityItem";
import { Entypo } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";

const rowCount = 3;
const rowMarginTop = 6;
const rowHeight = itemHeight + rowMarginTop;
const rowsHeight = rowCount * rowHeight;

export default () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0));

  const cities = useSelector(
    state => state.cities[state.cities.list],
    shallowEqual
  );

  const rows = cities.reduce(
    (row, city, index) => {
      row[index % rowCount].push({ index, item: city });
      return row;
    },
    Array.apply(null, Array(rowCount)).map(() => [])
  );

  useEffect(() => {
    Animated.timing(
      animation.current,
      { toValue: expanded ? 1 : 0, duration: 150 },
      { useNativeDriver: true }
    ).start();
  }, [expanded]);

  return (
    <View>
      <Animated.View
        style={{
          overflow: "hidden",
          height: animation.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, rowsHeight]
          })
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={true}
        >
          <View style={{ paddingHorizontal: 7 }}>
            {rows.map((row, index) => {
              return (
                <View
                  key={`${index}`}
                  style={{ flexDirection: "row", marginBottom: rowMarginTop }}
                >
                  {row.map((data, index) => (
                    <CityItem key={`${index}`} {...data} />
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
      <CityButton
        onPress={() => {
          setExpanded(!expanded);
        }}
        animation={animation}
      />
    </View>
  );
};

const CityButton = ({ onPress, animation }) => {
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
    <View style={styles.cityButton}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          paddingLeft: 10,
          paddingRight: 13,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Text>{value}</Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"]
                })
              }
            ]
          }}
        >
          <Entypo name="chevron-down" size={14} color={BLUE} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subText: {
    marginLeft: 20,
    marginBottom: 8,
    fontSize: 12,
    color: "#444",
    fontWeight: "600"
  },
  cityButton: {
    height: 44,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.04)",
    marginHorizontal: 10
  }
});
