import React from "react";
import { Provider } from "react-redux";
import "rxjs";
import { FacebookAds } from "expo";
import Navigator from "./src/Navigator";
import store from "./src/store";
import { DEV } from "./src/Constants";

if (DEV) {
  FacebookAds.AdSettings.addTestDevice(
    FacebookAds.AdSettings.currentDeviceHash
  );
}

export default () => (
  <Provider store={store}>
    <Navigator />
  </Provider>
);
