import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "feed");

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

function photo(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.photo !== undefined) {
        return payload.photo;
      }
      return state;
    default:
      return state;
  }
}

function name(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.name !== undefined) {
        return payload.name;
      }
      return state;
    default:
      return state;
  }
}

function number(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.number !== undefined) {
        return payload.number;
      }
      return state;
    default:
      return state;
  }
}

function code(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.code !== undefined) {
        return payload.code;
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  list,
  photo,
  name,
  number,
  code
});
