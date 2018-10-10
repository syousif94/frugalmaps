import { combineEpics } from "redux-observable";

import location from "./locationEpics";
import events from "./eventsEpics";

export default combineEpics(location, events);
