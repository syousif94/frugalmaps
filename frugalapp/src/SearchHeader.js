import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Entypo } from "@expo/vector-icons";

export default class SearchHeader extends Component {
  render() {
    const { value, onChangeText, title, placeholder } = this.props;

    return (
      <SafeAreaView>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.search}>
          <Entypo name="magnifying-glass" size={18} color="#000" />
          <TextInput
            ref={ref => (this._input = ref)}
            style={styles.input}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            placeholderTextColor="#333"
            returnKeyType="search"
            clearButtonMode="always"
            autoCorrect={false}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
  },
  search: {
    margin: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingLeft: 10,
    marginRight: 10,
    flex: 1
  }
});
