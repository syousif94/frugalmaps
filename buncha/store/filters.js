import { combineReducers } from "redux";
import { makeState } from "./reducers";
import moment from "moment";
import { detruncateTime, validateTime } from "../utils/Time";

const makeReducer = makeState("filters");

const currentTime = makeCurrentTime();
const day = makeReducer("day", currentTime.day);
const time = makeReducer("time", currentTime.time);
const validTime = makeReducer("validTime", true);
const notNow = makeReducer("notNow", false);

export default combineReducers({
  day,
  time,
  validTime,
  notNow
});

export const PAGE = {
  TYPE: "What",
  WHERE: "Where",
  WHEN: "When"
};

function makeCurrentTime() {
  const now = moment();
  const day = {
    title: now.format("dddd"),
    iso: now.weekday()
  };
  const time = now.format("h:mma");
  return {
    day,
    time
  };
}

export function resetTime() {
  return dispatch => {
    dispatch({
      type: "filters/set",
      payload: {
        ...makeCurrentTime(),
        validTime: true,
        notNow: false
      }
    });
  };
}

export function setDay(day) {
  return dispatch => {
    dispatch({
      type: "filters/set",
      payload: {
        day,
        time: "",
        notNow: true
      }
    });
  };
}

export function setTime(time) {
  return dispatch => {
    dispatch({
      type: "filters/set",
      payload: {
        time,
        notNow: true
      }
    });
    let validTime = true;
    if (time.trim().length) {
      const expandedTime = detruncateTime(time);
      validTime = validateTime(expandedTime);
    }
    dispatch({
      type: "filters/set",
      payload: {
        validTime
      }
    });
  };
}
