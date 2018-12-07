import { combineReducers } from "redux";
import moment from "moment";
import { createSelector } from "reselect";
import { createActions } from "./lib";
import _ from "lodash";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "events");

const groupData = hits => {
  if (!hits) {
    return [];
  }

  return _(hits)
    .groupBy(hit => hit._source.placeid)
    .map((events, _id) => {
      return {
        _id,
        type: "group",
        _source: events[0]._source,
        events
      };
    })
    .value();
};

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

export const markers = createSelector(
  state => state.events.day,
  state => state.events.data,
  state => state.events.calendar,
  (day, data, calendar) => {
    if (!day) {
      return [];
    }

    if (day === "All Events") {
      return groupData(data);
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
