import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default class RestaurantSuggestion extends Component {
  _onPress = () => {
    const { onPress, item } = this.props;

    onPress(item);
  };

  render() {
    const { item, index } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={this._onPress}>
          <Text style={styles.name}>
            {index + 1}. {item.name}
          </Text>
          <Text style={styles.address}>{item.formatted_address}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#e0e0e0"
  },
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
