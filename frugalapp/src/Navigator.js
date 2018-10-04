import React, { Component } from "react";
import { createBottomTabNavigator } from "react-navigation";

import MapScreen from "./MapScreen";
import CalendarScreen from "./CalendarScreen";
import SubmitScreen from "./SubmitScreen";
import EventProvider from "./Events";
import LocationProvider from "./Location";
import LocationResultsProvider from "./LocationResults";

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
    return (
      <LocationProvider>
        <EventProvider>
          <LocationResultsProvider>
            <MainScreen />
          </LocationResultsProvider>
        </EventProvider>
      </LocationProvider>
    );
  }
}
