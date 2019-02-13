import { combineReducers } from "redux";
import { createActions } from "./lib";
import { createSelector } from "reselect";

const mutations = ["set", "coordinates", "suggestions", "completions"];

export const { actions, types } = createActions(mutations, "location");

export const makeData = createSelector(
  (state, props) => props.tabLabel,
  state => state.location.popular,
  state => state.location.closest,
  state => state.location.completions,
  (type, popular, closest, completions) => {
    switch (type) {
      case "Closest":
        return closest;
      case "Popular":
        return popular;
      case "Search":
        return completions;
      default:
        break;
    }
  }
);

function coordinates(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.coordinates !== undefined) {
        return payload.coordinates;
      }
      return state;
    default:
      return state;
  }
}

function listTop(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.listTop !== undefined) {
        return payload.listTop;
      }
      return state;
    default:
      return state;
  }
}

function listBottom(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.listBottom !== undefined) {
        return payload.listBottom;
      }
      return state;
    default:
      return state;
  }
}

function focused(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.focused !== undefined) {
        return payload.focused;
      }
      return state;
    default:
      return state;
  }
}

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

function lastQuery(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.lastQuery !== undefined) {
        return payload.lastQuery;
      }
      return state;
    default:
      return state;
  }
}

function bounds(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.bounds !== undefined) {
        return payload.bounds;
      }
      return state;
    default:
      return state;
  }
}

function closest(state = [], { type, payload }) {
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

function popular(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.popular !== undefined) {
        return payload.popular;
      }
      return state;
    default:
      return state;
  }
}

function completions(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.completions !== undefined) {
        return payload.completions;
      }
      return state;
    default:
      return state;
  }
}

function authorized(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.authorized !== undefined) {
        return payload.authorized;
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  coordinates,
  listTop,
  focused,
  text,
  bounds,
  popular,
  closest,
  completions,
  listBottom,
  authorized,
  lastQuery
});
