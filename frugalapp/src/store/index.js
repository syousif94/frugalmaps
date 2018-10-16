import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import reducers from "./reducers";
import epics from "./epics";
import { DEV } from "../Constants";

const epicMiddleware = createEpicMiddleware(epics);

let middleware = [epicMiddleware];

if (DEV) {
  middleware = [createLogger(), ...middleware];
}

const configureStore = compose(applyMiddleware(...middleware))(createStore);

const store = configureStore(reducers, {});

export default store;
