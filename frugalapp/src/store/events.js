import { combineReducers } from "redux";
import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "events");

function refreshing(state = true, { type, payload }) {
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

const makeEvents = hits => {
  const initial = [
    { title: "Sunday", data: [] },
    { title: "Monday", data: [] },
    { title: "Tuesday", data: [] },
    { title: "Wednesday", data: [] },
    { title: "Thursday", data: [] },
    { title: "Friday", data: [] },
    { title: "Saturday", data: [] }
  ];

  if (!hits) {
    return initial;
  }

  hits.every(hit => {
    hit._source.days.forEach(day => {
      initial[day].data.push(hit);
    });
  });

  return initial.filter(day => day.data.length);
};

function data(state = makeEvents(), { type, payload }) {
  switch (type) {
    case types.set:
      if (payload.data !== undefined) {
        return makeEvents(payload.data);
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  refreshing,
  data
});
