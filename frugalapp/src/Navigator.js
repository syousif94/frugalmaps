import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";

import { ANDROID } from "./Constants";
import MapScreen from "./MapScreen";
import CalendarScreen from "./CalendarScreen";
import SubmitScreen from "./SubmitScreen";

import SubmissionsScreen from "./SubmissionsScreen";
import InfoScreen from "./InfoScreen";

import IntroScreen from "./IntroScreen";

import { watchNotifications } from "./Notifications";
import { watchLinking } from "./Linking";

import TabBar from "./TabBar";
import Updater from "./Updater";
import { sync } from "./User";
import RemindModal from "./RemindModal";

const TabScreen = createBottomTabNavigator(
  {
    Calendar: CalendarScreen,
    Submit: SubmitScreen,
    Map: MapScreen
  },
  {
    initialRoute: "Calendar",
    tabBarComponent: TabBar,
    lazy: ANDROID
  }
);

const MainScreen = createStackNavigator(
  {
    Home: TabScreen,
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
        {/* <RemindModal /> */}
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
