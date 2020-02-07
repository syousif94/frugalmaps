import React, { useRef } from "react";
import {
  createAppContainer,
  createStackNavigator,
  NavigationActions,
  createSwitchNavigator,
  createBottomTabNavigator
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
import TabBar from "../components/TabBar";
import User from "../utils/User";
import { NARROW, ANDROID } from "../utils/Constants";
import EventList from "../components/EventList";

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
  let Tabs;

  if (ANDROID) {
    const TabScreen = createBottomTabNavigator(
      {
        UpNext: {
          screen: UpNextScreen,
          path: ""
        },
        List: {
          screen: EventList,
          path: "list"
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

    Tabs = {
      screen: TabScreen
    };
  } else {
    Tabs = {
      screen: UpNextScreen
    };
  }

  const MainRouter = createSwitchNavigator(
    {
      Intro: {
        screen: IntroScreen
      },
      Tabs
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
    }
  };

  if (!ANDROID) {
    stackConfig = {
      ...stackConfig,
      Account: {
        screen: AccountScreen,
        path: "account"
      },
      Submit: {
        screen: SubmitScreen,
        path: "submit"
      }
    };
  }

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
