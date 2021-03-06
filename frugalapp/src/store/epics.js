import { combineEpics } from "redux-observable";

import location from "./locationEpics";
import events from "./eventsEpics";
import submission from "./submissionEpics";
import submissions from "./submissionsEpics";
import published from "./publishedEpics";
import search from "./searchEpics";

export default combineEpics(
  location,
  events,
  submission,
  submissions,
  published,
  search
);
