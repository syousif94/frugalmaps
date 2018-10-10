import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set", "coordinates", "suggestions", "completions"];

export const { actions, types } = createActions(mutations, "location");

function coordinates(state = null, { type, payload }) {
  return state;
}

function listTop(state = null, { type, payload }) {
  return state;
}

function focused(state = false, { type, payload }) {
  return state;
}

function searchValue(state = "", { type, payload }) {
  return state;
}

function suggestions(state = [], { type, payload }) {
  return state;
}

function completions(state = [], { type, payload }) {
  return state;
}

export default combineReducers({
  coordinates,
  listTop,
  focused,
  searchValue,
  suggestions,
  completions
});
