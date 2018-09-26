import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default class RestaurantSuggestion extends Component {
  _onPress = () => {
    const { onPress, item } = this.props;

    onPress(item);
  };

  render() {
    const { item, index } = this.props;

    return (
      <TouchableOpacity style={styles.item} onPress={this._onPress}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.formatted_address}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 10
  },
  name: {
    fontWeight: "500"
  },
  address: {
    marginTop: 2,
    color: "#a9a9a9"
  }
});
