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

function suggesting(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.suggesting !== undefined) {
        return payload.suggesting;
      }
      if (payload.filter && payload.filter.length) {
        return true;
      }
      return state;
    default:
      return state;
  }
}

function deleteMode(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.deleteMode !== undefined) {
        return payload.deleteMode;
      }
      return state;
    default:
      return state;
  }
}

function markedForDeletion(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.markedForDeletion !== undefined) {
        if (state.indexOf(payload.markedForDeletion) !== -1) {
          return state.filter(id => id !== payload.markedForDeletion);
        } else {
          return [payload.markedForDeletion, ...state];
        }
      }
      if (payload.deleteMode === false) {
        return [];
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
      if (payload.filter && !payload.filter.length) {
        return [];
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
        return payload.data;
      }
      return state;
    default:
      return state;
  }
}

function refreshing(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.refreshing !== undefined) {
        return payload.refreshing;
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
        return [...payload.newData, ...state];
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  suggesting,
  filter,
  restaurants,
  refreshing,
  data,
  newData,
  deleteMode,
  markedForDeletion
});
