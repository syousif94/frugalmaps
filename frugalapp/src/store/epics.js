import { combineEpics } from "redux-observable";

import location from "./locationEpics";
import events from "./eventsEpics";
import submission from "./submissionEpics";

export default combineEpics(location, events, submission);
