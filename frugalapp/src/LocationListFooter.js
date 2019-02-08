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
      refreshing: true,
      queryType: null
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  _onNewest = () => {
    emitter.emit("calendar-top");
    this.props.setEvents({
      refreshing: true,
      recent: true,
      queryType: null
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  _onWeekly = () => {
    emitter.emit("calendar-top", 0);
    this.props.setEvents({
      mode: "calendar"
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  _renderRightBtn = () => {
    if (this.props.locationAuthorized) {
      return (
        <View style={styles.footerBtnBg}>
          <TouchableOpacity onPress={this._onClosest} style={styles.footerBtn}>
            <View style={[styles.footerBtnIcon]} pointerEvents="none">
              <FontAwesome name="location-arrow" size={14} color="#fff" />
            </View>
            <Text style={styles.footerBtnText}>Current Location</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.footerBtnBg}>
          <TouchableOpacity onPress={this._onNewest} style={styles.footerBtn}>
            <View style={[styles.footerBtnIcon]} pointerEvents="none">
              <Entypo name="new" size={17} color="#fff" />
            </View>
            <Text style={styles.footerBtnText}>Most Recent</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.footer} pointerEvents="box-none">
        <View style={styles.footerBtnBg}>
          <TouchableOpacity onPress={this._onWeekly} style={styles.footerBtn}>
            <View style={[styles.footerBtnIcon]} pointerEvents="none">
              <Entypo name="calendar" size={17} color="#fff" />
            </View>
            <Text style={styles.footerBtnText}>Week View</Text>
          </TouchableOpacity>
        </View>
        {this._renderRightBtn()}
      </View>
    );
  }
}

const mapState = state => ({
  locationAuthorized: state.location.authorized
});

const mapActions = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

export default connect(
  mapState,
  mapActions
)(LocationListFooter);

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: LocationListFooter.height,
    flexDirection: "row",
    padding: 2
  },
  footerBtnBg: {
    flex: 1,
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
    marginLeft: 10
    // marginRight: 12
  }
});
