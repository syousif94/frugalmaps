import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Events from "../store/events";
import { BLUE } from "../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../screens";

const locationIssueRegex = new RegExp(
  `(${Events.EMPTY_LOCATION}|${Events.UNKNOWN_LOCATION})`,
  "gim"
);

export default () => {
  const error = useSelector(state => state.events.error);

  const isLocationIssue = error.match(locationIssueRegex);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Uh Oh</Text>
      <Text style={styles.errorText}>{error}</Text>
      {isLocationIssue ? <PlacesList /> : <RetryButton />}
    </View>
  );
};

const PlacesList = () => {
  const dispatch = useDispatch();
  const cities = useSelector(state => state.cities.popular, shallowEqual);
  return (
    <View style={styles.placeList}>
      <View
        style={{
          backgroundColor: "#f2f2f2",
          marginBottom: 20,
          borderRadius: 5,
          overflow: "hidden"
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 12
          }}
          onPress={() => {
            navigate("Add");
          }}
        >
          <Ionicons name="ios-add" size={24} color={BLUE} />
          <Text
            style={{
              marginLeft: 12,
              marginRight: 15,
              marginVertical: 7,
              fontSize: 16,
              color: BLUE,
              fontWeight: "600"
            }}
          >
            Add Some Events
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.placeText}>
        or check out some of our current cities
      </Text>
      <View>
        {cities.map(city => {
          const onPress = () => {
            dispatch(Events.getCity(city));
          };
          return (
            <View
              style={{
                backgroundColor: "#f2f2f2",
                marginVertical: 5,
                borderRadius: 5,
                overflow: "hidden"
              }}
              key={city._id}
            >
              <TouchableOpacity
                onPress={onPress}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{
                    padding: 7,
                    alignItems: "center",
                    minWidth: 36,
                    backgroundColor: "rgba(0,0,0,0.05)"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#666",
                      fontWeight: "700"
                    }}
                  >
                    {city._source.count}
                  </Text>
                </View>
                <Text
                  style={{
                    marginLeft: 8,
                    marginRight: 15,
                    fontSize: 16,
                    color: "#000",
                    fontWeight: "600"
                  }}
                >
                  {city._source.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const RetryButton = () => {
  const dispatch = useDispatch();
  return (
    <View style={styles.retry}>
      <TouchableOpacity
        onPress={() => {
          dispatch(Events.refresh());
        }}
        style={styles.retryButton}
      >
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 35
  },
  titleText: {
    fontSize: 48,
    color: "#aaa",
    fontWeight: "700"
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    lineHeight: 22
  },
  placeList: {
    marginTop: 20,
    marginBottom: 40
  },
  placeText: {
    fontSize: 13,
    marginBottom: 3,
    fontWeight: "400",
    color: "#444"
  },
  retry: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0"
  },
  retryButton: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  retryText: {
    fontSize: 14,
    color: "#888"
  }
});
