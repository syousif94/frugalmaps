import { combineReducers } from "redux";
import { makeState } from "./reducers";

const makeReducer = makeState("plans");

const data = makeReducer("data", {});

export default combineReducers({
  data
});
