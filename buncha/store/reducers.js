import { combineReducers } from "redux";

import events from "./events";
import permissions from "./permissions";
import cities from "./cities";

export default combineReducers({
  events,
  permissions,
  cities
});

export function makeState(prefix) {
  return function makeReducer(key, initialState, transforms) {
    let prefixedTransforms;
    if (transforms) {
      prefixedTransforms = {};
      for (const [key, value] of Object.entries(transforms)) {
        prefixedTransforms[`${prefix}/${key}`] = value;
      }
    }
    return function(state = initialState, { type, payload }) {
      if (!payload || payload[key] === undefined) {
        return state;
      }

      if (prefixedTransforms && prefixedTransforms[type]) {
        return prefixedTransforms[type](state, payload[key]);
      }

      switch (type) {
        case `${prefix}/set`:
          return payload[key];
        default:
          return state;
      }
    };
  };
}
