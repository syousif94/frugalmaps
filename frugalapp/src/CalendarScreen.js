import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import CalendarList from "./CalendarList";

import * as Events from "./store/events";
import CityPicker from "./CalendarCityPicker";
import CalendarInitial from "./CalendarInitial";
import CalendarMap from "./CalendarMap";
import Menu from "./Menu";
// import { ANDROID } from "./Constants";

class CalendarScreen extends Component {
  static id = "cal";

  componentDidMount() {
    this.props.fetch();
    // if (ANDROID) {
    //   this.props.fetch();
    // } else {
    //   this.props.restore();
    // }
  }

  render() {
    return (
      <View style={styles.container}>
        <CalendarMap />
        <CalendarList />
        <CityPicker tabLabel="Closest" />
        {/* <CalendarInitial />
        <Menu /> */}
      </View>
    );
  }
}

const mapDispatchToProps = {
  fetch: Events.actions.set.bind(null, { refreshing: true })
};

export default connect(
  null,
  mapDispatchToProps
)(CalendarScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef"
  }
});
