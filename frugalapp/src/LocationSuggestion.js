import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";

import * as Location from "./store/location";
import * as Events from "./store/events";
import emitter from "tiny-emitter/instance";

class LocationSuggestion extends Component {
  _onPress = () => {
    const { item, section, setLocation, setEvents } = this.props;

    let bounds;
    let text;

    if (section) {
      bounds = item._source.bounds;
      text = item._source.name;
    } else {
      bounds = item.geometry.viewport;
      text = item.formatted_address;
    }

    setEvents({
      refreshing: true,
      bounds
    });

    setLocation({
      text
    });

    emitter.emit("blur-location-box");
    emitter.emit("fit-bounds", bounds);
  };

  _renderCount = () => {
    const { item, section } = this.props;

    if (!section) {
      return null;
    }

    if (item._source.count !== undefined) {
      return (
        <View style={styles.count}>
          <Text style={styles.countText}>{item._source.count}</Text>
        </View>
      );
    } else if (item.sort[0]) {
      const miles = `${item.sort[0].toFixed(2)} mi`;
      return (
        <View style={styles.count}>
          <Text style={styles.countText}>{miles}</Text>
        </View>
      );
    }
  };

  render() {
    const { item, index, section } = this.props;

    let name = "";

    let addressText = "";

    if (section) {
      const [city, state] = item._source.name.split(", ");
      name = city;
      addressText = state;
    } else {
      name = item.name;

      const area = item.address_components.find(
        component => component.types.indexOf("administrative_area_level_1") > -1
      );

      const country = item.address_components.find(
        component => component.types.indexOf("country") > -1
      );

      if (area) {
        addressText += `${area.long_name}, `;
      }
      if (country) {
        addressText += country.long_name;
      }
    }

    return (
      <TouchableOpacity style={styles.item} onPress={this._onPress}>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address}>{addressText}</Text>
        </View>
        {this._renderCount()}
      </TouchableOpacity>
    );
  }
}

const mapDispatchToProps = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

export default connect(
  null,
  mapDispatchToProps
)(LocationSuggestion);

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
  address: {
    marginTop: 2,
    color: "#a9a9a9"
  },
  count: {
    height: 18,
    borderRadius: 9,
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginRight: 20
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "transparent"
  }
});
