import { combineReducers } from "redux";
import moment from "moment";
import { createSelector } from "reselect";
import { createActions } from "./lib";
import _ from "lodash";
import Immutable from "immutable";
import { makeYesterdayISO, timeRemaining } from "../Time";

const mutations = ["set", "restore", "fetch", "merge", "reorder"];

export const { actions, types } = createActions(mutations, "events");

const getPlaceid = (state, props) => props.item._source.placeid;
const getPlaces = state => state.events.places;

export const makeEventCount = () =>
  createSelector(
    [getPlaceid, getPlaces],
    (placeid, places) => places.get(placeid).length
  );

export const homeList = createSelector(
  state => state.events.day,
  state => state.events.list,
  state => state.events.calendar,
  state => state.events.recent,
  state => state.events.closest,
  (day, list, calendar, recent, closest) => {
    if (day === "Up Next") {
      return list;
    }
    if (day === "Newest") {
      return recent;
    }
    if (day === "Closest") {
      return closest;
    }
    const events = calendar.find(datum => {
      return datum.title === day;
    });

    return [events];
  }
);

export const placeEvents = createSelector(
  (state, props) => props.placeid,
  state => state.events.places,
  state => state.events.data,
  state => state.events.selectedEvent,
  (placeid, places, data, selected) => {
    if (!data.size || !places.size || !placeid) {
      return [];
    }

    const group = places.get(placeid);

    if (!group) {
      return [];
    }

    const today = moment().weekday();

    let sorted = group
      .map(id => data.get(id))
      .sort((_a, _b) => {
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

    sorted = sorted.sort((_a, _b) => {
      let a = 0;
      const aISO = makeYesterdayISO(_a._source.days);
      if (aISO) {
        const { ending: aEnding } = timeRemaining(
          _a._source.groupedHours[_a._source.groupedHours.length - 1],
          aISO
        );

        a = aEnding ? 1 : 0;
      }

      let b = 0;
      const bISO = makeYesterdayISO(_b._source.days);
      if (bISO) {
        const { ending: bEnding } = timeRemaining(
          _b._source.groupedHours[_b._source.groupedHours.length - 1],
          bISO
        );

        b = bEnding ? 1 : 0;
      }

      return a - b;
    });

    if (
      sorted.length > 1 &&
      selected.data &&
      placeid === selected.data._source.placeid
    ) {
      sorted = [
        selected.data,
        ...sorted.filter(event => {
          return (
            event._source.title !== selected.data._source.title &&
            event._id !== selected.id
          );
        })
      ];
    }

    return sorted;
  }
);

export const markerList = createSelector(
  state => state.events.day,
  state => state.events.markers,
  (day, data) => {
    if (!day || !data.length) {
      return [];
    }

    const dayEvents =
      data.find(datum => {
        return datum.title === day;
      }) || data[0];

    return dayEvents.data;
  }
);

function day(state = "Up Next", { type, payload }) {
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

function reordering(state = false, { type, payload }) {
  switch (type) {
    case types.reorder:
      return true;
    case types.set:
      if (payload.reordering !== undefined) {
        return payload.reordering;
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

function places(state = Immutable.Map(), { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.places !== undefined) {
        return Immutable.Map(payload.places);
      }
      return state;
    case types.merge:
      if (payload.data !== undefined) {
        let newState = state;
        payload.data.forEach(doc => {
          const place = state.get(doc._source.placeid);
          if (place && place.indexOf(doc._id) === -1) {
            newState = newState.set(doc._source.placeid, [doc._id, ...place]);
          } else if (!place) {
            newState = newState.set(doc._source.placeid, [doc._id]);
          }
        });
        return newState;
      }
      return state;
    default:
      return state;
  }
}

function data(state = Immutable.Map(), { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.data !== undefined) {
        return Immutable.Map(payload.data);
      }
      return state;
    case types.merge:
      if (payload.data !== undefined) {
        return state.merge(
          Immutable.Map(payload.data.map(doc => [doc._id, doc]))
        );
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

function recent(state = [{ title: "Newest", data: [] }], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.recent !== undefined) {
        return payload.recent;
      }
      return state;
    default:
      return state;
  }
}

function closest(state = [{ title: "Closest", data: [] }], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.closest !== undefined) {
        return payload.closest;
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
  list,
  markers,
  recent,
  reordering,
  closest,
  places
});
