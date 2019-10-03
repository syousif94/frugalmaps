import { combineReducers } from "redux";
import { makeState } from "./reducers";

const makeReducer = makeState("filters");

const page = makeReducer("page", null);

export default combineReducers({
  page
});

export const PAGE = {
  TYPE: "Type",
  WHERE: "Where",
  WHEN: "When"
};
