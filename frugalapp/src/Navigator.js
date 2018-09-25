import React, { Component } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "react-navigation";

import MapScreen from "./MapScreen";
import CalendarScreen from "./CalendarScreen";
import SubmitScreen from "./SubmitScreen";

import TabBar from "./TabBar";

const MainScreen = createBottomTabNavigator(
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

export default class Navigator extends Component {
  render() {
    return <MainScreen />;
  }
}
