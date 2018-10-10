import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import reducers from "./reducers";
import epics from "./epics";

const dev = process.env.NODE_ENV === "development";

const epicMiddleware = createEpicMiddleware(epics);

let middleware = [epicMiddleware];

if (dev) {
  middleware = [createLogger(), ...middleware];
}

const configureStore = compose(applyMiddleware(...middleware))(createStore);

const store = configureStore(reducers, {});

export default store;
