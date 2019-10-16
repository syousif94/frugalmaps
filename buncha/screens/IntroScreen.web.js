import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import { BLUE, RED } from "../utils/Colors";
import * as Cities from "../store/cities";
import * as Events from "../store/events";
import { FontAwesome } from "@expo/vector-icons";
import { enableLocation } from "../store/permissions";
import { getHistory } from ".";

export default ({ onComplete }) => {
  const dispatch = useDispatch();
  const cities = useSelector(state => state.cities.popular);
  const [opacity, setOpacity] = useState(location.pathname !== "/" ? 0 : 1);

  useEffect(() => {
    const history = getHistory();

    const unlisten = history.listen(location => {
      const home = location.pathname === "/";
      setOpacity(home ? 1 : 0);
    });

    return () => unlisten();
  }, []);

  useEffect(() => {
    dispatch(Cities.get());
  }, []);

  return (
    <ScrollView
      pointerEvents={opacity ? "auto" : "none"}
      style={styles.container}
      contentContainerStyle={{
        flex: 1,
        maxWidth: 520,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: 10,
        paddingTop: 70,
        opacity
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.98)",
          borderRadius: 8,
          paddingVertical: 30
        }}
      >
        <View
          style={{
            paddingHorizontal: 20
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700" }}>
            Welcome to Buncha
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "300",
              lineHeight: 25
            }}
          >
            We're a curated local calendar for happy hours, brunches, game
            nights, and more.
          </Text>
          <Text
            style={{
              marginTop: 40,
              fontSize: 14,
              fontWeight: "300"
            }}
          >
            Select a city or enable location access to get started.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 18,
            marginTop: 10
          }}
        >
          <View style={{ backgroundColor: BLUE, margin: 2, borderRadius: 2 }}>
            <TouchableOpacity
              style={{
                paddingVertical: 5,
                paddingHorizontal: 8,
                flexDirection: "row"
              }}
              onPress={() => {
                dispatch(enableLocation());
                onComplete();
              }}
            >
              <FontAwesome name="location-arrow" size={16} color="#fff" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                  fontWeight: "700",
                  marginLeft: 8
                }}
              >
                My Location
              </Text>
            </TouchableOpacity>
          </View>
          {!cities.length ? (
            <View>
              <Text>Loading Cities</Text>
            </View>
          ) : (
            cities.map(city => {
              const onPress = () => {
                dispatch(Events.getCity(city));
                onComplete();
              };
              return (
                <View
                  style={{
                    backgroundColor: RED,
                    margin: 2,
                    borderRadius: 2,
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
                        padding: 5,
                        backgroundColor: "rgba(0,0,0,0.15)"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#fff",
                          fontWeight: "700"
                        }}
                      >
                        {city._source.count}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginHorizontal: 8,
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "700"
                      }}
                    >
                      {city._source.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </View>
      <View style={{ height: 25 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});
