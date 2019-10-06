import { combineReducers } from "redux";
import { makeState } from "./reducers";
import { ABBREVIATED_DAYS } from "../utils/Constants";
import moment from "moment";

const makeReducer = makeState("filters");

const page = makeReducer("page", null);

const day = makeReducer("day", ABBREVIATED_DAYS[0]);
const hour = makeReducer("hour", 1);
const minutes = makeReducer("minutes", 0);
const meridian = makeReducer("meridian", "PM");

export default combineReducers({
  page,
  day,
  hour,
  minutes,
  meridian
});

export const PAGE = {
  TYPE: "Type",
  WHERE: "Where",
  WHEN: "When"
};

export function resetTime() {
  const now = moment();
  const day = now.format("ddd");
  const hour = parseInt(now.format("h"), 10);
  const minutes = parseInt(now.format("m"), 10);
  const meridian = now.format("A");
  return {
    type: "filters/set",
    payload: {
      day,
      hour,
      minutes,
      meridian
    }
  };
}
