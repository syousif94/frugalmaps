import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import CalendarList from "./CalendarList";

import * as Events from "./store/events";
import CalendarInitial from "./CalendarInitial";
import CalendarMap from "./CalendarMap";
import MenuButton from "./MenuButton";
import Menu from "./Menu";
import { ANDROID } from "./Constants";

class CalendarScreen extends Component {
  static id = "cal";

  componentDidMount() {
    if (ANDROID) {
      this.props.fetch();
    } else {
      this.props.restore();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CalendarMap />
        <CalendarList />
        <CalendarInitial />
        {/* <MenuButton />
        <Menu /> */}
      </View>
    );
  }
}

const mapDispatchToProps = {
  fetch: Events.actions.set.bind(null, { refreshing: true }),
  restore: Events.actions.restore
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
