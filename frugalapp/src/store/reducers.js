import { combineReducers } from "redux";

import events from "./events";
import location from "./location";

export default combineReducers({
  events,
  location
});
