import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import CalendarList from "./CalendarList";

import * as Events from "./store/events";
import CalendarMap from "./CalendarMap";
import SortBar from "./SortBar";

class CalendarScreen extends Component {
  static id = "cal";

  componentDidMount() {
    this.props.fetch();
  }

  _hideSortBar = () => {
    this._sort.getWrappedInstance().hide();
  };

  _setSortRef = ref => (this._sort = ref);

  render() {
    return (
      <View style={styles.container}>
        <CalendarMap />
        <CalendarList />
        <SortBar />
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
    backgroundColor: "#fff"
  }
});
