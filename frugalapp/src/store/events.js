import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "events");

export const markers = createSelector(
  state => state.events.day,
  state => state.events.data,
  (day, data) => {
    if (!day) {
      return [];
    }

    const dayEvents = data.find(datum => {
      return datum.title === day;
    });

    if (!dayEvents) {
      return [];
    }

    return dayEvents.data;
  }
);

function day(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.day !== undefined) {
        return payload.day;
      }
      return state;
    default:
      return state;
  }
}

function initialized(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.initialized !== undefined) {
        return payload.initialized;
      }
      return state;
    default:
      return state;
  }
}

function refreshing(state = true, { type, payload }) {
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

export default combineReducers({
  refreshing,
  data,
  day,
  initialized
});
