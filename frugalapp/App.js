import React from "react";
import { Provider } from "react-redux";
import "rxjs";
import Navigator from "./src/Navigator";
import store from "./src/store";

export default () => (
  <Provider store={store}>
    <Navigator />
  </Provider>
);
