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
import CityItem from "./CityItem";

export default () => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(false);
  const animation = useRef(new Animated.Value(0));

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

  useEffect(() => {
    Animated.timing(
      animation.current,
      { toValue: expanded ? 1 : 0, duration: 150 },
      { useNativeDriver: true }
    ).start();
  }, [expanded]);

  return (
    <View>
      <CityButton
        onPress={() => {
          setExpanded(!expanded);
        }}
        animation={animation}
      />
      <Animated.View
        style={{
          overflow: "hidden",
          height: animation.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, height]
          })
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={true}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0
          }}
          onLayout={e => {
            setHeight(e.nativeEvent.layout.height);
          }}
        >
          <View style={{ paddingHorizontal: 7 }}>
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
      </Animated.View>
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
        style={{ flex: 1, paddingHorizontal: 10, justifyContent: "center" }}
      >
        <Text>{value}</Text>
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
