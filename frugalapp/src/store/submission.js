import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "submission");

function id(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.id !== undefined) {
        return payload.id;
      }
      return state;
    default:
      return state;
  }
}

function eventType(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.eventType !== undefined) {
        return payload.eventType;
      }
      return state;
    default:
      return state;
  }
}

function title(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.title !== undefined) {
        return payload.title;
      }
      return state;
    default:
      return state;
  }
}

function description(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.description !== undefined) {
        return payload.description;
      }
      return state;
    default:
      return state;
  }
}

function startTime(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.startTime !== undefined) {
        return payload.startTime;
      }
      return state;
    default:
      return state;
  }
}

function endTime(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.endTime !== undefined) {
        return payload.endTime;
      }
      return state;
    default:
      return state;
  }
}

function postCode(state = "", { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.postCode !== undefined) {
        return payload.postCode;
      }
      return state;
    default:
      return state;
  }
}

function place(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.place !== undefined) {
        return payload.place;
      }
      return state;
    default:
      return state;
  }
}

function days(state = [], { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.days !== undefined) {
        return payload.days;
      }
      return state;
    default:
      return state;
  }
}

function saving(state = false, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.saving !== undefined) {
        return payload.saving;
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  id,
  eventType,
  title,
  description,
  startTime,
  endTime,
  postCode,
  place,
  days,
  saving
});
