import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { DEV } from "../utils/Constants";

let middleware = [thunk];

if (DEV) {
  middleware = [...middleware, createLogger()];
}

const configureStore = compose(applyMiddleware(...middleware))(createStore);

const store = configureStore(reducers, {});

export default store;
