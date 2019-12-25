import { combineReducers } from "redux";
import { makeState } from "./reducers";

const makeReducer = makeState("browser");

export const MODES = ["restaurant", "submission"];

const url = makeReducer("url", null);
const mode = makeReducer("mode", MODES[0]);

export default combineReducers({
  url,
  mode
});
