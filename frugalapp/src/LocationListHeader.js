import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { MapView } from "expo";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";

import * as Location from "./store/location";
import * as Events from "./store/events";

class LocationListHeader extends PureComponent {
  _onClosest = () => {
    emitter.emit("calendar-top");
    this.props.setEvents({
      refreshing: true
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  _onNewest = () => {
    emitter.emit("calendar-top");
    this.props.setEvents({
      refreshing: true,
      recent: true
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  render() {
    const closeStyle = { paddingLeft: 12 };
    const newStyle = { paddingLeft: 10, paddingTop: 2 };
    return (
      <View style={styles.map}>
        <MapView pointerEvents="none" style={styles.map} showsUserLocation />
        <View style={styles.header}>
          <View style={styles.headerBtnBg}>
            <TouchableOpacity onPress={this._onNewest} style={styles.headerBtn}>
              <View
                style={[styles.headerBtnIcon, newStyle]}
                pointerEvents="none"
              >
                <Entypo name="new" size={17} color="#fff" />
              </View>
              <Text style={styles.headerBtnText}>Newest</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerBtnBg}>
            <TouchableOpacity
              onPress={this._onClosest}
              style={styles.headerBtn}
            >
              <View
                style={[styles.headerBtnIcon, closeStyle]}
                pointerEvents="none"
              >
                <FontAwesome name="location-arrow" size={14} color="#fff" />
              </View>
              <Text style={styles.headerBtnText}>Closest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
)(LocationListHeader);

const styles = StyleSheet.create({
  map: {
    height: 120
  },
  header: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 38,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2
  },
  headerBtnBg: {
    margin: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  headerBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  headerBtnIcon: {
    justifyContent: "center",
    alignItems: "center"
  },
  headerBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 12
  }
});
