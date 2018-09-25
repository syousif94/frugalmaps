import React, { Component } from "react";
import { View } from "react-native";
import {
  createBottomTabNavigator,
  createDrawerNavigator
} from "react-navigation";
import SideMenu from "react-native-side-menu";
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

class Menu extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#e0e0e0"
        }}
      />
    );
  }
}

export default class Navigator extends Component {
  render() {
    return (
      <SideMenu menu={<Menu />} edgeHitWidth={50}>
        <MainScreen />
      </SideMenu>
    );
  }
}
