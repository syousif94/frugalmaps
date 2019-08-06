import { combineReducers } from "redux";
import api from "../utils/API";
import { makeState } from "./reducers";

const makeReducer = makeState("submissions");

const list = makeReducer("list", [], {
  prepend: (state, payload) => [payload, ...state]
});
const fetchingList = makeReducer("fetchingList", false);
const fetchingPublished = makeReducer("fetchingPublished", false);
const published = makeReducer("published", []);

export default combineReducers({
  list,
  fetchingList,
  published,
  fetchingPublished
});

export function getSubmissions() {
  return async dispatch => {
    dispatch({
      type: "submissions/set",
      payload: {
        fetchingList: true
      }
    });

    try {
      const res = await api("events/submissions");

      dispatch({
        type: "submissions/set",
        payload: {
          fetchingList: false,
          list: res.submissions
        }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "submissions/set",
        payload: {
          fetchingList: false
        }
      });
    }
  };
}

export function getPublished() {
  return async dispatch => {
    dispatch({
      type: "submissions/set",
      payload: {
        fetchingPublished: true
      }
    });

    try {
      const res = await api("events/published");

      dispatch({
        type: "submissions/set",
        payload: {
          fetchingPublished: false,
          published: res.published
        }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "submissions/set",
        payload: {
          fetchingPublished: false
        }
      });
    }
  };
}
