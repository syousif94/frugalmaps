import { combineReducers } from "redux";

import events from "./events";
import location from "./location";
import submission from "./submission";
import submissions from "./submissions";
import published from "./published";

export default combineReducers({
  events,
  location,
  submission,
  submissions,
  published
});
