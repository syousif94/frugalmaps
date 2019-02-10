import { combineReducers } from "redux";
import moment from "moment";
import { createSelector } from "reselect";
import { createActions } from "./lib";
import _ from "lodash";

const mutations = ["set", "restore", "fetch", "merge"];

export const { actions, types } = createActions(mutations, "events");

export const homeList = createSelector(
  state => state.events.mode,
  state => state.events.list,
  state => state.events.calendar,
  (mode, list, calendar) => {
    switch (mode) {
      case "list":
        return list;
      case "calendar":
        return calendar;
      default:
        return [];
    }
  }
);

export const placeEvents = createSelector(
  (state, props) => props.placeid,
  state => state.events.data,
  (placeid, data) => {
    if (!data || !placeid) {
      return [];
    }
    const groups = _(data)
      .groupBy(hit => hit._source.placeid)
      .value();

    const group = groups[placeid];

    const today = moment().weekday();

    return group.sort((_a, _b) => {
      let a = _a._source.groupedHours[0].iso - today;
      if (a < 0) {
        a += 7;
      }
      let b = _b._source.groupedHours[0].iso - today;
      if (b < 0) {
        b += 7;
      }
      return a - b;
    });
  }
);

export const markerList = createSelector(
  state => state.events.day,
  state => state.events.markers,
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
    case types.merge:
      if (payload.data !== undefined) {
        const newIDs = payload.data.map(doc => doc._id);
        const newState = state.filter(doc => {
          return newIDs.indexOf(doc._id) === -1;
        });
        return [...newState, ...payload.data];
      }
      return state;
    default:
      return state;
  }
}

function markers(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.markers !== undefined) {
        return payload.markers;
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

function queryType(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.queryType !== undefined) {
        return payload.queryType;
      }
      return state;
    default:
      return state;
  }
}

function mode(state = "list", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.mode !== undefined) {
        return payload.mode;
      }
      return state;
    default:
      return state;
  }
}

function list(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.list !== undefined) {
        return payload.list;
      }
      return state;
    default:
      return state;
  }
}

function adKey(state = `${Date.now()}`, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.adKey !== undefined) {
        return payload.adKey;
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
  queryType,
  refreshing,
  data,
  calendar,
  day,
  initialized,
  selectedEvent,
  mode,
  list,
  markers,
  adKey
});
