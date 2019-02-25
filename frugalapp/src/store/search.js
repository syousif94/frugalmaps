import { combineReducers } from "redux";
import { createActions } from "./lib";
import { createSelector } from "reselect";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "search");

function text(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.text !== undefined) {
        return payload.text;
      }
      return state;
    default:
      return state;
  }
}

function results(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.results !== undefined) {
        return payload.results;
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  text,
  results
});
