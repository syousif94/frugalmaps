import React from "react";
import { View } from "react-native";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UpNextScreen from "./UpNextScreen";
import DetailScreen from "./DetailScreen";
import MenuScreen from "./MenuScreen";
import MapScreen from "./MapScreen";
import IntroScreen from "./IntroScreen";
import AccountScreen from "./AccountScreen";
import SubmitScreen from "./SubmitScreen";

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
    component: UpNextScreen,
    path: "/",
    exact: true
  },
  Detail: {
    component: DetailScreen,
    path: "/e/:id"
  },
  Menu: {
    component: MenuScreen,
    path: "/menu",
    exact: true
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
  Submit: {
    component: SubmitScreen,
    path: "/submit",
    exact: true
  }
};

const WebRoutesGenerator = ({ routeMap }) => {
  return Object.keys(routeMap).map((route, index) => {
    const currentRoute = routeMap[route];
    const Component = currentRoute.component;
    return (
      <Route
        key={currentRoute.path}
        path={currentRoute.path}
        exact={currentRoute.exact}
        render={props => (
          <Wrapper element={<Component />} {...props} routeMap={routeMap} />
        )}
      />
    );
  });
};

// const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return children;
// });

export default () => {
  return (
    <Router ref={setTopLevelNavigator}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {WebRoutesGenerator({ routeMap })}
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
