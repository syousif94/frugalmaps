import React, { useState } from "react";
import { View } from "react-native";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UpNextScreen from "./UpNextScreen";
import DetailScreen from "./DetailScreen";
import MapScreen from "./MapScreen";
import IntroScreen from "./IntroScreen";
import AccountScreen from "./AccountScreen";
import SubmitScreen from "./SubmitScreen";
import InterestedModal from "../components/InterestedModal";
import PlanScreen from "./PlanScreen";
import NotFoundScreen from "./NotFoundScreen";

function Wrapper({ element, history, match, routeMap, closeModal }) {
  const navigate = (to, params) => {
    let url = routeMap[to].path;
    // replace params ids in the url with actual values
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        const re = RegExp(`\:${param}\\??`); // eslint-disable-line no-useless-escape
        url = url.replace(re, escape(params[param]));
      });
    }
    // removing empty params from url - every string between /: and ?
    url = url.replace(/\/:(.*?)(?=\/|$)/g, "");

    history.push(url);
  };

  const getParam = (param, alternative) => {
    return match.params[param] || alternative;
  };

  const goBack = () => {
    history.goBack();
  };

  return React.cloneElement(element, {
    navigation: { navigate, getParam, goBack },
    closeModal
  });
}

const routeMap = {
  Intro: {
    component: IntroScreen,
    path: "/intro",
    exact: true
  },
  UpNext: {
    component: () => <View pointerEvents="none" />,
    path: "/",
    exact: true
  },
  Detail: {
    component: DetailScreen,
    path: "/e/:id"
  },
  Plan: {
    component: PlanScreen,
    path: "/plan/:eid"
  },
  Planned: {
    component: PlanScreen,
    path: "/p/:id"
  },
  Map: {
    component: MapScreen,
    path: "/map",
    exact: true
  },
  Account: {
    component: AccountScreen,
    path: "/account",
    exact: true
  },
  Add: {
    component: SubmitScreen,
    path: "/add",
    exact: true
  },
  NotFound: {
    component: NotFoundScreen
  }
};

const WebRoutesGenerator = ({ routeMap }) => {
  return Object.keys(routeMap).map((route, index) => {
    const currentRoute = routeMap[route];
    const Component = currentRoute.component;
    return (
      <Route
        key={currentRoute.path || "notFound"}
        path={currentRoute.path}
        exact={currentRoute.exact}
        render={props => (
          <Wrapper element={<Component />} {...props} routeMap={routeMap} />
        )}
      />
    );
  });
};

export default () => {
  const [intro, setIntro] = useState(!localStorage["intro"]);

  return (
    <Router ref={setTopLevelNavigator}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <UpNextScreen intro={intro} />
        {intro ? (
          <IntroScreen
            onComplete={() => {
              localStorage["intro"] = "complete";
              setIntro(false);
            }}
          />
        ) : null}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="box-none"
        >
          <Switch>{WebRoutesGenerator({ routeMap })}</Switch>
        </View>
        <InterestedModal />
      </View>
    </Router>
  );
};

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export function getHistory() {
  return _navigator && _navigator.history;
}

export function navigate(to, params) {
  let url = routeMap[to].path;
  // replace params ids in the url with actual values
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(param => {
      const re = RegExp(`\:${param}\\??`); // eslint-disable-line no-useless-escape
      url = url.replace(re, escape(params[param]));
    });
  }
  // removing empty params from url - every string between /: and ?
  url = url.replace(/\/:(.*?)(?=\/|$)/g, "");

  _navigator.history.push(url);
}
