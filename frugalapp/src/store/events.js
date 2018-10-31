import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "events");

export const markers = createSelector(
  state => state.events.day,
  state => state.events.data,
  state => state.events.calendar,
  (day, data, calendar) => {
    if (!day) {
      return [];
    }

    if (day === "All Events") {
      return data;
    }

    const dayEvents = calendar.find(datum => {
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

function calendar(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.calendar !== undefined) {
        return payload.calendar;
      }
      return state;
    default:
      return state;
  }
}

function selectedEvent(state = { id: null, data: null }, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.selectedId !== undefined) {
        return {
          id: payload.selectedId,
          data: null
        };
      }
      if (payload.selectedEvent !== undefined) {
        if (payload.selectedEvent.id && payload.selectedEvent.id === state.id) {
          return payload.selectedEvent;
        } else {
          return {
            id: payload.selectedEvent.data._id,
            data: payload.selectedEvent.data
          };
        }
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  refreshing,
  data,
  calendar,
  day,
  initialized,
  selectedEvent
});
