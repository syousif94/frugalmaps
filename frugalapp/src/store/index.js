import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import reducers from "./reducers";
import epics from "./epics";
import { DEV } from "../Constants";
import { Permissions } from "expo";
import * as Location from "./location";

const epicMiddleware = createEpicMiddleware(epics);

let middleware = [epicMiddleware];

if (DEV) {
  middleware = [createLogger(), ...middleware];
}

const configureStore = compose(applyMiddleware(...middleware))(createStore);

const store = configureStore(reducers, {});

export default store;

async function checkLocationPermission() {
  const { status: locationStatus } = await Permissions.getAsync(
    Permissions.LOCATION
  );

  if (locationStatus === "granted") {
    store.dispatch(Location.actions.set({ authorized: true }));
  }
}

checkLocationPermission();
