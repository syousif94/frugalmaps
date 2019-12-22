import { combineReducers } from "redux";
import api from "../utils/API";
import moment from "moment";
import { makeState } from "./reducers";
import { timeRemaining } from "../utils/Time";

const makeReducer = makeState("interested");

export const MODES = ["Always", "Dates", "Never"];

const event = makeReducer("event", null);
const mode = makeReducer("mode", MODES[0]);
const selected = makeReducer("selected", new Set());
const selectedTimes = makeReducer("selectedTimes", {});
const selectedDate = makeReducer("selectedDate", null);

export default combineReducers({
  event,
  mode,
  selected,
  selectedTimes,
  selectedDate
});

export function setTime({ text }) {
  return (dispatch, getState) => {
    const {
      interested: { mode, selectedDate, selectedTimes }
    } = getState();

    if (mode === MODES[0]) {
      dispatch({
        type: "interested/set",
        payload: {
          selectedTimes: {
            ...selectedTimes,
            [mode]: text
          }
        }
      });
    } else if (selectedDate) {
      dispatch({
        type: "interested/set",
        payload: {
          selectedTimes: {
            ...selectedTimes,
            [selectedDate]: text
          }
        }
      });
    }
  };
}

export function getTime(state) {
  const {
    interested: { mode, selectedDate, selectedTimes }
  } = state;

  if (mode === MODES[0]) {
    return selectedTimes[mode] || "";
  } else if (selectedDate) {
    return selectedTimes[selectedDate] || "";
  }
  return "";
}

export function show({ event }) {
  const days = event._source.groupedHours
    .reduce((groups, group) => {
      const days = group.days.map(day => {
        return {
          ...day,
          hours: group
        };
      });

      return [...groups, ...days];
    }, [])
    .sort((a, b) => {
      return a.daysAway - b.daysAway;
    });

  const nextDate = moment();

  let selectedDate;
  let day = days[0];

  let ended;
  if (!day.daysAway) {
    const remaining = timeRemaining(day.hours, day.iso);
    ended = remaining.ended;
    if (ended && days[1]) {
      day = days[1];
    }
  }

  const startInt = parseInt(day.hours.start, 10);
  const startHours = Math.floor(startInt / 100);
  const startMinutes = startInt % 100;

  const endInt = parseInt(day.hours.end, 10);

  selectedDate = nextDate
    .day(day.iso)
    .hour(startHours)
    .minute(startMinutes);

  if (ended && !days.length) {
    selectedDate.add(1, "w");
  }

  const selectedId = selectedDate.format("Y-M-D");

  return {
    type: "interested/set",
    payload: {
      event,
      mode: MODES[0],
      selected: new Set([selectedId]),
      selectedTimes: {}
    }
  };
}

export function select({ id }) {
  return (dispatch, getState) => {
    const selected = getState().interested.selected;
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    dispatch({
      type: "interested/set",
      payload: {
        selected: new Set(selected)
      }
    });
  };
}
