import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set", "reset"];

export const { actions, types } = createActions(mutations, "submission");

function id(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.id !== undefined) {
        return payload.id;
      }
      return state;
    case types.reset:
      return null;
    default:
      return state;
  }
}

function fid(state = null, { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.fid !== undefined) {
        return payload.fid;
      }
      return state;
    case types.reset:
      return null;
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
    case types.reset:
      return null;
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
    case types.reset:
      return "";
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
    case types.reset:
      return "";
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
    case types.reset:
      return "";
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
    case types.reset:
      return "";
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
    case types.reset:
      return null;
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
    case types.reset:
      return [];
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
    case types.reset:
      return false;
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
    case types.reset:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  id,
  fid,
  eventType,
  title,
  description,
  startTime,
  endTime,
  postCode,
  place,
  days,
  saving,
  deleting
});
