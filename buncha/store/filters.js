import { combineReducers } from "redux";
import { makeState } from "./reducers";
import moment from "moment";

const makeReducer = makeState("filters");

const page = makeReducer("page", null);

const currentTime = makeCurrentTime();
const day = makeReducer("day", currentTime.day);
const hour = makeReducer("hour", currentTime.hour);
const minutes = makeReducer("minutes", currentTime.minutes);
const meridian = makeReducer("meridian", currentTime.meridian);

export default combineReducers({
  page,
  day,
  hour,
  minutes,
  meridian
});

export const PAGE = {
  TYPE: "What",
  WHERE: "Where",
  WHEN: "When"
};

function makeCurrentTime() {
  const now = moment();
  const day = now.format("dddd");
  const hour = parseInt(now.format("h"), 10);
  const minutes = parseInt(now.format("m"), 10);
  const meridian = now.format("A");
  return {
    day,
    hour,
    minutes,
    meridian
  };
}

export function resetTime() {
  return {
    type: "filters/set",
    payload: makeCurrentTime()
  };
}
