import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BLUE } from "../utils/Colors";
import EventItem from "../components/EventItem";
import { navigate } from ".";
import { getInset } from "../utils/SafeAreaInsets";

export default () => {
  return (
    <View style={styles.container}>
      <View
        style={{ flex: 1, maxWidth: 500, width: "100%", alignSelf: "center" }}
      >
        <View
          style={{
            paddingTop: getInset("top") + 40,
            paddingHorizontal: 20,
            paddingBottom: 40
          }}
        >
          <Text style={{ fontSize: 18 }}>Welcome to Buncha</Text>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "600" }}>
            We're a nearby events calendar for you and your favorite contacts.
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            borderTopWidth: 1,
            borderColor: "#e0e0e0",
            borderBottomWidth: 1
          }}
        >
          <EventItem demo />
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: BLUE,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 290,
          width: "100%",
          alignSelf: "center",
          marginHorizontal: 10,
          borderRadius: 8
        }}
        onPress={() => {
          navigate("Account");
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Login or Sign up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginBottom: getInset("bottom") + 15,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 500,
          width: "100%",
          alignSelf: "center",
          marginHorizontal: 10
        }}
        onPress={() => {
          navigate("UpNext");
        }}
      >
        <Text style={{ color: BLUE, fontSize: 16, fontWeight: "700" }}>
          Later
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
