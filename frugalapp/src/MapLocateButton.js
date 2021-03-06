import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { FontAwesome } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";
import { grantLocation } from "./Permissions";
import * as Events from "./store/events";

const mapDispatchToProps = {
  set: Events.actions.set
};

class LocateMe extends Component {
  _onPress = async () => {
    const { mapId } = this.props;
    if (!mapId) {
      return;
    }
    try {
      await grantLocation();
      emitter.emit(mapId);
    } catch (error) {
      return;
    }
  };

  _onLongPress = () => {
    const { size = "large" } = this.props;
    if (size === "small") {
      return;
    }
    this.props.set({
      refreshing: true
    });
  };

  render() {
    const { size = "large" } = this.props;

    let style = [styles.locate];
    let iconSize = 16;
    if (size === "small") {
      style.push(styles.locateSmall);
      iconSize = 14;
    } else {
      style.push(styles.locateLarge);
    }

    return (
      <View style={style}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._onPress}
          onLongPress={this._onLongPress}
        >
          <FontAwesome name="location-arrow" size={iconSize} color={"#fff"} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(LocateMe);

const styles = StyleSheet.create({
  locate: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.75)"
  },
  locateSmall: {
    top: 8,
    right: 8,
    height: 32,
    width: 32,
    borderRadius: 5
  },
  locateLarge: {
    bottom: 12,
    right: 12,
    height: 44,
    width: 44,
    borderRadius: 8
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
