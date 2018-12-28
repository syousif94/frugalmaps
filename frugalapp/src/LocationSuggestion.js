import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";

import * as Location from "./store/location";
import * as Events from "./store/events";
import emitter from "tiny-emitter/instance";

class LocationSuggestion extends Component {
  _onPress = () => {
    const { item, type, setLocation, setEvents } = this.props;

    let bounds;
    let text;

    emitter.emit("calendar-top");

    if (type !== "Autocomplete") {
      bounds = item._source.bounds;
      text = item._source.name;
    } else {
      bounds = item.geometry.viewport;
      text = item.formatted_address;
    }

    setEvents({
      refreshing: true,
      bounds,
      queryType: "City"
    });

    setLocation({
      lastQuery: text,
      text,
      bounds: null
    });

    emitter.emit("blur-location-box", this.props.id);
    emitter.emit("fit-bounds", bounds);
  };

  _resetOnRelease = false;

  _onPressIn = () => {
    const { item, type } = this.props;

    let bounds;

    if (type !== "Autocomplete") {
      bounds = item._source.bounds;
    } else {
      bounds = item.geometry.viewport;
    }

    this._resetOnRelease = true;
    emitter.emit("preview-bounds", bounds);
  };

  _onPressOut = () => {
    if (this._resetOnRelease) {
      this._resetOnRelease = false;
      emitter.emit("reset-bounds-preview");
    }
  };

  _renderCount = () => {
    const { item, type } = this.props;

    if (type === "Autocomplete") {
      return null;
    }

    if (item._source.count !== undefined) {
      return (
        <View style={styles.count}>
          <Text style={styles.countText}>{item._source.count}</Text>
        </View>
      );
    }

    return null;
  };

  _renderDistance = () => {
    const { item, type } = this.props;

    if (type !== "Closest") {
      return null;
    }

    if (item.sort && item.sort[0]) {
      const miles = `${item.sort[0].toFixed(2)} mi`;
      return (
        <View style={styles.count}>
          <Text style={styles.countText}>{miles}</Text>
        </View>
      );
    }

    return null;
  };

  render() {
    const { item, index, type } = this.props;

    let name = `${index + 1}. `;

    let addressText = "";

    if (type !== "Autocomplete") {
      const [city, state] = item._source.name.split(", ");
      name += city;
      addressText = state;
    } else {
      name += item.name;

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
      <TouchableOpacity
        style={styles.item}
        delayLongPress={250}
        onPress={this._onPress}
        onLongPress={this._onPressIn}
        onPressOut={this._onPressOut}
      >
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address}>{addressText}</Text>
        </View>
        <View style={styles.counts}>
          {this._renderDistance()}
          {this._renderCount()}
        </View>
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
  counts: {
    flexDirection: "row",
    marginRight: 10
  },
  count: {
    height: 18,
    borderRadius: 9,
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginRight: 10
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "transparent"
  }
});
