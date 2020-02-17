import React, { useRef } from "react";
import {
  createAppContainer,
  createStackNavigator,
  NavigationActions,
  createSwitchNavigator
} from "react-navigation";
import { View, StyleSheet } from "react-native";
import { ScreenOrientation } from "expo";

import UpNextScreen from "./UpNextScreen";
import DetailScreen from "./DetailScreen";
import IntroScreen from "./IntroScreen";
import AccountScreen from "./AccountScreen";
import SubmitScreen from "./SubmitScreen";
import Updater from "../components/Updater";
import FilterView from "../components/FilterView";
import InterestedModal from "../components/InterestedModal";
import PlanScreen from "./PlanScreen";
import Browser from "../components/Browser";
import User from "../utils/User";
import { NARROW } from "../utils/Constants";

async function lockOrientation() {
  if (NARROW) {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.log(error);
    }
  }
}

lockOrientation();

function makeAppContainer() {
  const MainRouter = createSwitchNavigator(
    {
      Intro: {
        screen: IntroScreen
      },
      Tabs: {
        screen: UpNextScreen
      }
    },
    {
      initialRouteName: /** User.needsIntro ? "Intro" :*/ "Tabs"
    }
  );

  let stackConfig = {
    Main: {
      screen: MainRouter,
      path: ""
    },
    Detail: {
      screen: DetailScreen,
      path: "e/:id"
    },
    Plan: {
      screen: PlanScreen,
      path: "plan/:eid"
    },
    Planned: {
      screen: PlanScreen,
      path: "p/:id"
    },
    Account: {
      screen: AccountScreen,
      path: "account"
    },
    Submit: {
      screen: SubmitScreen,
      path: "submit"
    }
  };

  const RootScreen = createStackNavigator(stackConfig, {
    headerMode: "none"
  });

  return createAppContainer(RootScreen);
}

export default () => {
  const AppContainer = useRef(makeAppContainer());
  return (
    <View style={styles.container}>
      <AppContainer.current ref={setTopLevelNavigator} />
      <Browser />
      <FilterView />
      <InterestedModal />
      <Updater />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

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

export function pop() {
  _navigator && _navigator.dispatch(NavigationActions.back());
}
