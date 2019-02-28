import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";

// import MapScreen from "./MapScreen";
import CalendarScreen from "./CalendarScreen";
import SubmitScreen from "./SubmitScreen";
// import FriendsScreen from "./FriendsScreen";

import SubmissionsScreen from "./SubmissionsScreen";
import InfoScreen from "./InfoScreen";

import IntroScreen from "./IntroScreen";

import { watchNotifications } from "./Notifications";
import { watchLinking } from "./Linking";

import Updater from "./Updater";
import { sync } from "./User";

import GoingModal from "./GoingModal";

const HomeScreen = createStackNavigator(
  {
    Calendar: CalendarScreen,
    Submit: SubmitScreen
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRoute: "Calendar"
  }
);

const MainScreen = createStackNavigator(
  {
    Home: HomeScreen,
    Submissions: SubmissionsScreen,
    Info: InfoScreen
  },
  {
    initialRoute: "Home",
    headerMode: "none"
  }
);

const SwitchScreen = createSwitchNavigator(
  {
    Intro: IntroScreen,
    Main: MainScreen
  },
  {
    initialRoute: "Intro",
    headerMode: "none"
  }
);

export default class Navigator extends Component {
  componentDidMount() {
    sync();

    watchNotifications(this._nav);

    watchLinking(this._nav);
  }

  render() {
    return (
      <View style={styles.container}>
        <SwitchScreen ref={ref => (this._nav = ref)} />
        <GoingModal />
        <Updater />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
