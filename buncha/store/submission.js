import { combineReducers } from "redux";
import api from "../utils/API";
import { makeState } from "./reducers";
import locate from "../utils/Locate";
import { detruncateTime, validateTime } from "../utils/Time";

const makeReducer = makeState("submission");

const id = makeReducer("id", null);
const fid = makeReducer("fid", null);
const title = makeReducer("title", "");
const description = makeReducer("description", "");
const start = makeReducer("start", "");
const end = makeReducer("end", "");
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
  start,
  end,
  postCode,
  place,
  fetchingPlace,
  days,
  tags,
  saving,
  deleting
});

export function restore(payload) {
  return async dispatch => {
    dispatch({
      type: "submission/set",
      payload: {
        fetchingPlace: true
      }
    });
    try {
      const { placeid, ...event } = payload;
      const res = await api("places/id", { placeid });
      const place = res.restaurant;
      dispatch({
        type: "submission/set",
        payload: {
          place,
          fetchingPlace: false,
          ...event
        }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "submission/set",
        payload: {
          fetchingPlace: false
        }
      });
    }
  };
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
        fetchingPlace: false
      }
    });
  };
}

export function reset() {
  return {
    type: "submission/set",
    payload: {
      id: null,
      fid: null,
      title: "",
      description: "",
      start: "",
      end: "",
      postCode: "",
      place: "",
      days: [],
      tags: []
    }
  };
}

export function submitEvent() {
  return async (dispatch, getState) => {
    const {
      submission: {
        place,
        title,
        description,
        start,
        end,
        days,
        postCode,
        tags
      }
    } = getState();

    const payload = {
      placeid: place && place.place_id,
      title,
      description,
      start: start.trim().length ? detruncateTime(start) : null,
      end: end.trim().length ? detruncateTime(end) : null,
      days,
      postCode: postCode.trim(),
      tags
    };

    const issues = submissionIssues(payload);

    if (issues.length) {
      alert(`Please fix the following issues:\n${issues.join("\n")}`);
      return;
    }

    dispatch({
      type: "submission/set",
      payload: {
        saving: true
      }
    });

    try {
      const res = await api("save-event", payload);
      console.log({ res });
      dispatch({
        type: "submission/set",
        payload: {
          saving: false
        }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "submission/set",
        payload: {
          saving: false
        }
      });
    }
  };
}

function submissionIssues(payload) {
  console.log({ payload });
  const validStart = payload.start === null || validateTime(payload.start);
  const validEnd = payload.end === null || validateTime(payload.end);
  const hasPlace = payload.placeid;
  const hasTitle = payload.title.length > 0;
  const hasDays = payload.days.length > 0;
  const hasTags = payload.tags.length > 0;

  const issues = [];

  if (!hasPlace) {
    issues.push("Missing a location");
  }
  if (!hasTitle) {
    issues.push("Missing a title");
  }
  if (!hasDays) {
    issues.push("No days are selected");
  }
  if (!validStart) {
    issues.push("Start time is invalid");
  }
  if (!validEnd) {
    issues.push("End time is invalid");
  }
  if (!hasTags) {
    issues.push("No tags are selected");
  }

  return issues;
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
