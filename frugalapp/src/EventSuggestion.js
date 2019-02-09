import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as Events from "./store/events";

class Suggestion extends Component {
  _onPress = () => {
    const { set, navigation, item } = this.props;

    set({
      selectedEvent: {
        data: item
      }
    });

    navigation.navigate("Info");
  };

  render() {
    const {
      item: { _source: item, sort, _id: id },
      index
    } = this.props;

    let cityText = item.city;

    if (sort && sort[0]) {
      cityText = `${sort[0].toFixed(1)}mi · ${cityText}`;
    }

    return (
      <TouchableOpacity style={styles.item} onPress={this._onPress}>
        <View style={styles.info}>
          <Text style={styles.name}>
            {index + 1}. {item.title}
          </Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.city}>{cityText}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect(
  null,
  {
    set: Events.actions.set
  }
)(withNavigation(Suggestion));

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center"
  },
  info: {
    padding: 10,
    flex: 1
  },
  name: {
    fontWeight: "500"
  },
  location: {
    marginTop: 1,
    fontSize: 12,
    color: "#000",
    fontWeight: "500"
  },
  city: {
    marginTop: 1,
    fontSize: 12,
    color: "#444"
  },
  description: {
    marginTop: 2,
    color: "#444"
  }
});
