import React, { Component } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import "rxjs";
import { FacebookAds } from "expo";
import Navigator from "./src/Navigator";
import store from "./src/store";
import { DEV, IOS } from "./src/Constants";
import { AppLoading } from "expo";
import cache from "./src/CacheAssets";
import "./src/Firebase";
import "./src/CalendarManager";
import "./src/NotificationUpdater";

if (DEV) {
  FacebookAds.AdSettings.addTestDevice(
    FacebookAds.AdSettings.currentDeviceHash
  );
}

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
