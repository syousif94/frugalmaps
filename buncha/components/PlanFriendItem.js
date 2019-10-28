import React from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";

export default ({ item, index }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Image style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  button: {
    height: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#f4f4f4",
    marginLeft: 15,
    marginRight: 8
  },
  content: {
    flex: 1
  },
  nameText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500"
  }
});
