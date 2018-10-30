import React, { Component } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import "rxjs";
import { FacebookAds } from "expo";
import Navigator from "./src/Navigator";
import store from "./src/store";
import { DEV } from "./src/Constants";
import { AppLoading } from "expo";
import cache from "./src/CacheAssets";

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
    StatusBar.setHidden(false);
    StatusBar.setBarStyle("dark-content");
  }

  state = {
    isReady: false
  };

  _loadAssets = async () => {
    await cache();
  };

  render() {
    if (!DEV && !this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssets}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return <App />;
  }
}
