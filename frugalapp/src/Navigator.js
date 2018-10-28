import React, { Component } from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";

import MapScreen from "./MapScreen";
import CalendarScreen from "./CalendarScreen";
import SubmitScreen from "./SubmitScreen";

import PublishedScreen from "./PublishedScreen";
import SubmissionsScreen from "./SubmissionsScreen";
// import Info from "./InfoScreen";

import TabBar from "./TabBar";

const TabScreen = createBottomTabNavigator(
  {
    Calendar: CalendarScreen,
    Submit: SubmitScreen,
    Map: MapScreen
  },
  {
    initialRoute: "Calendar",
    tabBarComponent: TabBar,
    lazy: false
  }
);

const MainScreen = createStackNavigator(
  {
    Home: TabScreen,
    Published: PublishedScreen,
    Submissions: SubmissionsScreen
    // Info: InfoScreen
  },
  {
    initialRoute: "Home",
    headerMode: "none"
  }
);

export default class Navigator extends Component {
  render() {
    return <MainScreen />;
  }
}
