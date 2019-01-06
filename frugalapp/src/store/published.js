import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set", "count"];

export const { actions, types } = createActions(mutations, "published");

function filter(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.filter !== undefined) {
        return payload.filter;
      }
      return state;
    default:
      return state;
  }
}

function suggesting(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.suggesting !== undefined) {
        return payload.suggesting;
      }
      if (payload.filter && payload.filter.length) {
        return true;
      }
      return state;
    default:
      return state;
  }
}

function deleteMode(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.deleteMode !== undefined) {
        return payload.deleteMode;
      }
      return state;
    default:
      return state;
  }
}

function deleting(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.deleting !== undefined) {
        return payload.deleting;
      }
      return state;
    default:
      return state;
  }
}

function markedForDeletion(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.markedForDeletion !== undefined) {
        if (state.indexOf(payload.markedForDeletion) !== -1) {
          return state.filter(id => id !== payload.markedForDeletion);
        } else {
          return [payload.markedForDeletion, ...state];
        }
      }
      if (payload.deleteMode === false) {
        return [];
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

function count(state = 0, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.count !== undefined) {
        return payload.count;
      }
      return state;
    default:
      return state;
  }
}

function refreshing(state = false, { type, payload }) {
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

export default combineReducers({
  count,
  deleting,
  suggesting,
  filter,
  refreshing,
  data,
  deleteMode,
  markedForDeletion
});
