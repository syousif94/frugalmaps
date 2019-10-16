import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BLUE } from "../utils/Colors";
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
