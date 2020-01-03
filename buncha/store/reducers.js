import { combineReducers } from "redux";

export default combineReducers({
  events: require("./events").default,
  permissions: require("./permissions").default,
  cities: require("./cities").default,
  submission: require("./submission").default,
  submissions: require("./submissions").default,
  filters: require("./filters").default,
  plans: require("./plans").default,
  interested: require("./interested").default,
  browser: require("./browser").default,
  user: require("./user").default
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
