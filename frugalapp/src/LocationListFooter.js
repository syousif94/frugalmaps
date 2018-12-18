import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";

import * as Location from "./store/location";
import * as Events from "./store/events";

class LocationListFooter extends PureComponent {
  static height = 38;
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
      <View style={styles.footer} pointerEvents="box-none">
        <View style={styles.footerBtnBg}>
          <TouchableOpacity onPress={this._onNewest} style={styles.footerBtn}>
            <View style={[styles.footerBtnIcon, newStyle]} pointerEvents="none">
              <Entypo name="new" size={17} color="#fff" />
            </View>
            <Text style={styles.footerBtnText}>Newest</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerBtnBg}>
          <TouchableOpacity onPress={this._onClosest} style={styles.footerBtn}>
            <View
              style={[styles.footerBtnIcon, closeStyle]}
              pointerEvents="none"
            >
              <FontAwesome name="location-arrow" size={14} color="#fff" />
            </View>
            <Text style={styles.footerBtnText}>Closest</Text>
          </TouchableOpacity>
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
)(LocationListFooter);

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: LocationListFooter.height,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2
  },
  footerBtnBg: {
    margin: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  footerBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  footerBtnIcon: {
    justifyContent: "center",
    alignItems: "center"
  },
  footerBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 12
  }
});
