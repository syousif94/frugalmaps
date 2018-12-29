import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { createActions } from "./lib";
import _ from "lodash";

const mutations = ["set", "reload"];

export const { actions, types } = createActions(mutations, "submissions");

export const restaurantSuggestions = createSelector(
  state => state.submissions.restaurants,
  state => state.submissions.filter,
  (restaurants, filter) => (filter.length ? restaurants : [])
);

function filter(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.filter !== undefined) {
        return payload.filter;
      }
      return state;
    default:
      return state;
  }
}

function restaurants(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.restaurants !== undefined) {
        return payload.restaurants;
      }
      return state;
    default:
      return state;
  }
}

function data(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.data !== undefined) {
        return [payload.data, ...state];
      }
      return state;
    default:
      return state;
  }
}

function newData(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.newData !== undefined) {
        return [payload.newData, ...state];
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  filter,
  restaurants,
  data,
  newData
});
