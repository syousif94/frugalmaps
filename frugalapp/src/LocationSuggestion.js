import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default class LocationSuggestion extends Component {
  _onPress = () => {
    const { onPress, item } = this.props;

    onPress(item);
  };

  render() {
    const { item, index } = this.props;

    const area = item.address_components.find(
      component => component.types.indexOf("administrative_area_level_1") > -1
    );

    const country = item.address_components.find(
      component => component.types.indexOf("country") > -1
    );

    let addressText = "";

    if (area) {
      addressText += `${area.long_name}, `;
    }
    if (country) {
      addressText += country.long_name;
    }

    return (
      <TouchableOpacity style={styles.item} onPress={this._onPress}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{addressText}</Text>
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
