import React from "react";
import { View, StyleSheet, ScrollView, Text, Linking } from "react-native";
import Link from "./Link";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { RED, BLUE, NOW } from "../utils/Colors";

export default ({ item }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        <Link
          style={[styles.link]}
          onPress={() => {
            Linking.openURL(`tel:${item._source.phone}`);
          }}
        >
          <FontAwesome
            style={{ marginTop: 1 }}
            name="phone"
            size={14}
            color={NOW}
          />
          <Text style={[styles.titleText, { marginLeft: 6 }]}>Call</Text>
        </Link>
        <Link
          to={item._source.website}
          style={styles.link}
          onPress={() => {
            if (WEB) {
              window.open(item._source.website, "_blank");
            } else {
              Linking.openURL(item._source.website);
            }
          }}
        >
          <Entypo
            style={{ marginTop: 1.5 }}
            name="link"
            size={14}
            color={BLUE}
          />
          <Text style={[styles.titleText, { marginLeft: 6 }]}>Website</Text>
        </Link>
        <Link
          style={styles.link}
          onPress={() => {
            if (WEB) {
              window.open(item._source.url, "_blank");
            } else {
              Linking.openURL(item._source.url);
            }
          }}
        >
          <FontAwesome name="map-marker" size={14} color={RED} />
          <Text style={[styles.titleText, { marginLeft: 6 }]}>Google Maps</Text>
        </Link>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2"
  },
  scrollContent: {
    paddingHorizontal: 3.5,
    paddingVertical: 6
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600"
  },
  link: {
    borderRadius: 8,
    marginHorizontal: 2.5,
    paddingHorizontal: 15,
    backgroundColor: "#f4f4f4",
    height: 44,
    flexDirection: "row",
    alignItems: "center"
  }
});