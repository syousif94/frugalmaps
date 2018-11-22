import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";

import { ANDROID } from "./Constants";
import MapScreen from "./MapScreen";
import CalendarScreen from "./CalendarScreen";
import SubmitScreen from "./SubmitScreen";

import PublishedScreen from "./PublishedScreen";
import SubmissionsScreen from "./SubmissionsScreen";
import InfoScreen from "./InfoScreen";

import TabBar from "./TabBar";
import Updater from "./Updater";

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
    Published: PublishedScreen,
    Submissions: SubmissionsScreen,
    Info: InfoScreen
  },
  {
    initialRoute: "Home",
    headerMode: "none"
  }
);

export default class Navigator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MainScreen />
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
