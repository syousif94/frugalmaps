import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set", "coordinates", "suggestions", "completions"];

export const { actions, types } = createActions(mutations, "location");

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

function suggestions(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.suggestions !== undefined) {
        return payload.suggestions;
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

export default combineReducers({
  coordinates,
  listTop,
  focused,
  text,
  bounds,
  suggestions,
  completions,
  listBottom
});
