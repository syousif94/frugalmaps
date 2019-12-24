import React, { Component } from "react";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import { StatusBar, View } from "react-native";
import store from "./store";
import cache from "./utils/Cache";
import Navigator from "./screens";
import { IOS } from "./utils/Constants";

console.disableYellowBox = true;

const App = () => (
  <Provider store={store}>
    <Navigator />
  </Provider>
);

export default class extends Component {
  componentDidMount() {
    if (IOS) {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle("dark-content");
    }
  }

  state = {
    isReady: false
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={cache}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return <App />;
  }
}
