import { combineEpics } from "redux-observable";

import location from "./locationEpics";
import events from "./eventsEpics";
import submission from "./submissionEpics";
import submissions from "./submissionsEpics";

export default combineEpics(location, events, submission, submissions);
