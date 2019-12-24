import { combineReducers } from "redux";
import api from "../utils/API";
import moment from "moment";
import { makeState } from "./reducers";
import { timeRemaining, detruncateTime, validateTime } from "../utils/Time";
import { ISO_ABBREVIATED_DAYS } from "../utils/Constants";

const makeReducer = makeState("interested");

export const MODES = ["Always", "Dates", "Never"];

const event = makeReducer("event", null);
const mode = makeReducer("mode", MODES[0]);
const selected = makeReducer("selected", new Set());
const selectedTimes = makeReducer("selectedTimes", {});
const editingDate = makeReducer("editingDate", null);

export default combineReducers({
  event,
  mode,
  selected,
  selectedTimes,
  editingDate
});

export function setTime({ text }) {
  return (dispatch, getState) => {
    const {
      interested: { mode, editingDate, selectedTimes }
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
    } else if (editingDate) {
      dispatch({
        type: "interested/set",
        payload: {
          selectedTimes: {
            ...selectedTimes,
            [editingDate]: text
          }
        }
      });
    }
  };
}

export function getTime(state) {
  const {
    interested: { mode, editingDate, selectedTimes }
  } = state;

  if (mode === MODES[0]) {
    return selectedTimes[mode] || "";
  } else if (editingDate) {
    return selectedTimes[editingDate] || "";
  }
  return "";
}

export function getValidated(event, selected) {
  return state => {
    let valid = true;
    let expanded = null;
    let inRange = valid;
    let range = "";

    if (!event) {
      return {
        expanded,
        valid,
        inRange,
        range
      };
    }

    const {
      interested: { mode, selectedTimes }
    } = state;

    const id = selected !== undefined ? selected : state.interested.editingDate;

    let value;
    if (mode === MODES[0]) {
      value = selectedTimes[mode] || "";
    } else if (id) {
      value = selectedTimes[id] || "";
    }

    let iso = null;
    if (typeof id === "string") {
      const date = moment(id, ["Y-M-D"]);
      iso = date.weekday();
    } else {
      iso = id;
    }

    let hours;
    if (iso !== null) {
      const group = event._source.groupedHours.find(group =>
        group.days.find(day => day.iso === iso)
      );

      const start = parseInt(group.start, 10);
      let end = parseInt(group.end, 10);
      if (end < start) {
        end += 2400;
      }

      hours = {
        start,
        end
      };

      range = `${ISO_ABBREVIATED_DAYS[iso]} ${group.hours}`;
    } else {
      let startStr;
      let endStr;
      hours = event._source.groupedHours.reduce(
        (hours, group, index) => {
          const start = parseInt(group.start, 10);
          let end = parseInt(group.end, 10);
          if (end < start) {
            end += 2400;
          }

          const splitTime = group.hours.split(" - ");

          if (!index) {
            startStr = splitTime[0];
            endStr = splitTime[1];
            return {
              start,
              end
            };
          }

          if (start > hours.start) {
            startStr = splitTime[0];
            hours.start = start;
          }
          if (end < hours.end) {
            endStr = splitTime[1];
            hours.end = end;
          }

          return hours;
        },
        {
          start: 0,
          end: 0
        }
      );

      range = `${startStr} - ${endStr}`;
    }

    if (!value || !value.trim().length) {
      return {
        expanded,
        valid,
        inRange,
        range
      };
    }

    expanded = detruncateTime(value);
    valid = validateTime(expanded);
    if (valid && expanded && !value.match(":") && value.match(/(a|p)/gi)) {
      expanded = value.match("m") ? null : `${value}m`;
    }

    inRange = valid;
    if (valid) {
      let time = parseInt(moment(expanded, ["h:ma", "H:m"]).format("HHmm"));
      const today = time >= hours.start && time < hours.end;
      let tomorrow = false;
      if (time < hours.start && time <= 1200) {
        time += 2400;
        tomorrow = time < hours.end;
      }
      inRange = today || tomorrow;
    }

    return {
      expanded,
      valid,
      inRange,
      range
    };
  };
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
      selectedTimes: {},
      editingDate: null
    }
  };
}

export function select({ id }) {
  return (dispatch, getState) => {
    const {
      interested: { selected, editingDate }
    } = getState();
    let editing;
    if (selected.has(id)) {
      selected.delete(id);
      editing = editingDate === id ? null : undefined;
    } else {
      selected.add(id);
    }
    dispatch({
      type: "interested/set",
      payload: {
        selected: new Set(selected),
        editingDate: editing
      }
    });
  };
}
