import { combineReducers } from "redux";
import api from "../utils/API";
import { makeState } from "./reducers";
import locate from "../utils/Locate";

const makeReducer = makeState("submission");

const id = makeReducer("id", null);
const fid = makeReducer("fid", null);
const title = makeReducer("title", "");
const description = makeReducer("description", "");
const startTime = makeReducer("startTime", "");
const endTime = makeReducer("endTime", "");
const postCode = makeReducer("postCode", "");
const place = makeReducer("place", null);
const fetchingPlace = makeReducer("place", false);
const days = makeReducer("days", [], {
  toggle: (state, payload) => {
    if (state.indexOf(payload) > -1) {
      return state.filter(val => val !== payload);
    }
    return [...state, payload];
  }
});
const tags = makeReducer("tags", [], {
  toggle: (state, payload) => {
    if (state.indexOf(payload) > -1) {
      return state.filter(val => val !== payload);
    }
    return [...state, payload];
  }
});
const saving = makeReducer("saving", false);
const deleting = makeReducer("deleting", null);

export default combineReducers({
  id,
  fid,
  title,
  description,
  startTime,
  endTime,
  postCode,
  place,
  fetchingPlace,
  days,
  tags,
  saving,
  deleting
});

export function restore(event) {
  return async dispatch => {};
}

export function getPlace(placeid) {
  return async dispatch => {
    dispatch({
      type: "submission/set",
      payload: {
        fetchingPlace: true
      }
    });
    const res = await api("places/id", { placeid });
    const place = res.restaurant;
    dispatch({
      type: "submission/set",
      payload: {
        place,
        fetchingPlace: true
      }
    });
  };
}

export function set(key) {
  return function(val) {
    return {
      type: "submission/set",
      payload: {
        [key]: val
      }
    };
  };
}

export function toggle(key) {
  return function(val) {
    return {
      type: "submission/toggle",
      payload: {
        [key]: val
      }
    };
  };
}
