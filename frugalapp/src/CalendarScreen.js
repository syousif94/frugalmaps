import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import CalendarList from "./CalendarList";
import moment from "moment";

import * as Events from "./store/events";
import { SafeArea } from "./Constants";
import CalendarView from "./Calendar";
import MenuButton from "./MenuButton";
import Menu from "./Menu";

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
    const { location } = this.props;

    const today = moment();

    const day = today.format("dddd, MMMM D, Y");

    const locationText = location.length ? location : "Loading";
    return (
      <View style={styles.container}>
        <SafeArea style={styles.header}>
          <Text style={styles.subtitleText}>{day}</Text>
          <Text style={styles.titleText}>{locationText}</Text>
        </SafeArea>
        <CalendarList />
        <MenuButton />
        <Menu />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  titleText: {
    fontSize: 18,
    marginTop: 5
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: "600"
  }
});

const mapState = state => ({
  location: state.location.lastQuery
});

const mapDispatchToProps = {
  fetch: Events.actions.set.bind(null, { refreshing: true })
};

export default connect(
  mapState,
  mapDispatchToProps
)(CalendarScreen);
