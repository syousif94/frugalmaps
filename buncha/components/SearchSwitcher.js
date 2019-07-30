import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export default ({ setPage, pages, page: currentPage }) => {
  return (
    <View style={styles.container}>
      {pages.map((page, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setPage(page);
            }}
            key={`${index}`}
            style={[
              styles.button,
              {
                backgroundColor: currentPage === page ? "rgba(0,0,0,0.6)" : null
              }
            ]}
          >
            <Text style={styles.text}>{page}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    height: 40,
    padding: 2,
    flexDirection: "row"
  },
  button: {
    margin: 2,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    flex: 1
  },
  text: {
    fontSize: 18,
    color: "#fff"
  }
});
