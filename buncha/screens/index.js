import React from "react";
import {
  createAppContainer,
  createStackNavigator,
  NavigationActions,
  createBottomTabNavigator,
  createSwitchNavigator
} from "react-navigation";

import TabBar from "../components/TabBar";
import UpNextScreen from "./UpNextScreen";
import DetailScreen from "./DetailScreen";
import IntroScreen from "./IntroScreen";
import AccountScreen from "./AccountScreen";
import SubmitScreen from "./SubmitScreen";

const TabScreen = createBottomTabNavigator(
  {
    UpNext: {
      screen: UpNextScreen,
      path: ""
    },
    Map: {
      screen: require("./MapScreen").default,
      path: "map"
    },
    Account: {
      screen: AccountScreen,
      path: "account"
    },
    Submit: {
      screen: SubmitScreen,
      path: "submit"
    }
  },
  {
    tabBarComponent: props => <TabBar {...props} />
  }
);

const MainRouter = createSwitchNavigator(
  {
    Intro: {
      screen: IntroScreen
    },
    Tabs: {
      screen: TabScreen
    }
  },
  {
    initialRouteName: "Tabs"
  }
);

const RootScreen = createStackNavigator(
  {
    Main: {
      screen: MainRouter,
      path: ""
    },
    Detail: {
      screen: DetailScreen,
      path: "e/:id"
    }
  },
  {
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(RootScreen);

export default () => {
  return <AppContainer ref={setTopLevelNavigator} />;
};

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export function navigate(routeName, params) {
  _navigator &&
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    );
}
