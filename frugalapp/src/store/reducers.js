import { combineReducers } from "redux";

import events from "./events";
import location from "./location";
import submission from "./submission";
import submissions from "./submissions";
import published from "./published";
import search from "./search";
import going from "./going";

export default combineReducers({
  events,
  location,
  submission,
  submissions,
  published,
  search,
  going
});
