import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "going");

function selected(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.selected) {
        return payload.selected;
      }
      return state;
    default:
      return state;
  }
}

function visible(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.selected !== undefined) {
        return !!payload.selected;
      }
      return state;
    default:
      return state;
  }
}

function selectedDays(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.selectedDays !== undefined) {
        return payload.selectedDays;
      }
      if (payload.toggleDay !== undefined) {
        if (state.indexOf(payload.toggleDay) > -1) {
          return state.filter(day => day !== payload.toggleDay);
        } else {
          return [payload.toggleDay, ...state];
        }
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  selected,
  selectedDays,
  visible
});
