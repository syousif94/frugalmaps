import { combineReducers } from "redux";
import api from "../utils/API";
import moment from "moment";
import { makeState } from "./reducers";
import locate from "../utils/Locate";
import {
  groupHours,
  makeYesterdayISO,
  timeRemaining,
  detruncateTime
} from "../utils/Time";
import { WEB, DEV, IOS } from "../utils/Constants";
import emitter from "tiny-emitter/instance";
import _ from "lodash";

const makeReducer = makeState("events");

const refreshing = makeReducer("refreshing", false);
const searching = makeReducer("searching", null);
const now = makeReducer("now", Date.now());
const error = makeReducer("error", null);
const upNext = makeReducer("upNext", []);
const calendar = makeReducer("calendar", []);
const closest = makeReducer("closest", []);
const newest = makeReducer("newest", []);
const city = makeReducer("city", null);
const markers = makeReducer("markers", []);
const bounds = makeReducer("bounds", null);
const tags = makeReducer("tags", []);
const tag = makeReducer("tag", null);
const text = makeReducer("text", "");
const selected = makeReducer("selected", null);
// if day is set, ignore now
const notNow = makeReducer("notNow", false);
const day = makeReducer("day", null);

const data = makeReducer(
  "data",
  {},
  {
    set: (state, payload) => {
      return { ...state, ...payload };
    },
    append: (state, payload) => {
      return { ...state, ...payload };
    }
  }
);
const places = makeReducer(
  "places",
  {},
  {
    append: (state, payload) => {
      return { ...state, ...payload };
    }
  }
);

export default combineReducers({
  refreshing,
  searching,
  error,
  upNext,
  places,
  city,
  markers,
  bounds,
  data,
  calendar,
  closest,
  newest,
  selected,
  notNow,
  day,
  tags,
  now,
  tag,
  text
});

export function selectEvent(id) {
  return {
    type: "events/set",
    payload: {
      selected: id
    }
  };
}

export function deselectEvent(id) {
  return (dispatch, getState) => {
    const {
      events: { selected }
    } = getState();

    if (selected === id) {
      dispatch({
        type: "events/set",
        payload: {
          selected: null
        }
      });
    }
  };
}

export function getCity(city) {
  return async dispatch => {
    try {
      dispatch({
        type: "events/set",
        payload: {
          city: {
            text: city._source.name,
            bounds: city._source.bounds
          },
          tag: null,
          text: "",
          tags: WEB ? [] : undefined
        }
      });
      dispatch(refresh(city._source.bounds));
    } catch (error) {}
  };
}

const debouncedGet = _.debounce((dispatch, args) => {
  dispatch(get(args));
}, 150);

export function filter({ tag = null, text = "" }) {
  return (dispatch, getState) => {
    const {
      events: { bounds, text: prevText, notNow }
    } = getState();

    dispatch({
      type: "events/set",
      payload: {
        tag,
        text,
        now: notNow ? Date.now() : undefined
      }
    });

    if (text.length || (prevText.length && !tag)) {
      debouncedGet(dispatch, { bounds, searching: true, notNow: false });
    } else {
      dispatch(get({ bounds, notNow: false }));
    }
  };
}

export function refresh(bounds = null, refresh = false) {
  return dispatch => {
    dispatch({
      type: "events/set",
      payload: {
        now: Date.now(),
        text: "",
        tag: null
      }
    });
    dispatch(get({ bounds, refresh, notNow: false }));
  };
}

export const EMPTY_LOCATION = "We don't have any data for";
export const UNKNOWN_LOCATION = "We can't determine your location";

export function get({
  bounds = null,
  refresh = false,
  searching = false,
  notNow
}) {
  return async (dispatch, getState) => {
    const searchingTime = searching ? Date.now() : null;

    dispatch({
      type: "events/set",
      payload: {
        refreshing: searching ? undefined : true,
        searching: searchingTime,
        city: bounds ? undefined : null,
        bounds,
        upNext: WEB && !searching ? [] : undefined,
        selected: null,
        error: null
      }
    });

    const {
      permissions: { location: locationEnabled },
      events: { now, tag, text }
    } = getState();

    const time = moment(now);
    const body = {
      now,
      utc: time.utcOffset(),
      tags: tag ? [tag] : [],
      text
    };

    if (locationEnabled) {
      const {
        coords: { latitude, longitude }
      } = await locate();

      body.lat = latitude;
      body.lng = longitude;
    }

    if (bounds || refresh) {
      if (!searching) {
        emitter.emit("refresh");
      }

      body.bounds = bounds;
    }
    if (DEV) {
      console.log({ body });
    }
    try {
      const res = await api("events", body);

      if (DEV) {
        console.log({ res });
      }

      // const res = require("../events.json");

      // console.log(res);

      const city =
        res.city && res.city.text
          ? {
              ...res.city,
              text: res.city.text
                .split(",")
                .map(s => s.replace(/[0-9]/g, "").trim())
                .join(", ")
            }
          : bounds
          ? undefined
          : null;

      let searchCompleted = undefined;
      if (searching) {
        const {
          events: { searching }
        } = getState();

        if (searching === searchingTime) {
          searchCompleted = null;
        }
      }

      if (res.empty) {
        if (searching) {
          dispatch({
            type: "events/set",
            payload: {
              searching: searchCompleted
            }
          });
          return;
        }

        const error =
          city && city.text
            ? `${EMPTY_LOCATION} ${city.text} yet.`
            : UNKNOWN_LOCATION;
        dispatch({
          type: "events/set",
          payload: {
            refreshing: false,
            searching: searchCompleted,
            upNext: [],
            calendar: [],
            closest: [],
            newest: [],
            tags: [],
            error,
            city,
            notNow,
            day: null
          }
        });
        return;
      }

      if (bounds && IOS && !searching) {
        await new Promise(resolve => {
          setTimeout(resolve, 1500);
        });
      }

      const filtering = tag || text.length;

      dispatch({
        type: "events/set",
        payload: {
          refreshing: searching ? undefined : false,
          searching: searchCompleted,
          upNext: res.list[0].data,
          calendar: res.calendar,
          closest: res.closest ? res.closest[0].data : [],
          newest: res.newest[0].data,
          places: filtering ? undefined : res.places,
          city,
          markers: res.markers[0].data,
          bounds: filtering ? undefined : res.bounds,
          data: res.data,
          tags: filtering ? undefined : res.tags,
          notNow,
          day: null
        }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "events/set",
        payload: {
          searching: null,
          refreshing: searching ? undefined : false,
          error: error,
          notNow,
          day: null
        }
      });
    }
  };
}

export function getEvent(id) {
  return async dispatch => {
    console.log(id);
    try {
      const payload = await api("fetch-event", { id }).then(res => {
        const payload = {
          places: {
            [res.events[0]._source.placeid]: []
          },
          data: {}
        };
        res.events.forEach(hit => {
          hit._source.groupedHours = groupHours(hit._source);
          payload.places[hit._source.placeid].push(hit._id);
          payload.data[hit._id] = hit;
        });
        return payload;
      });
      console.log({ payload });
      dispatch({
        type: "events/append",
        payload
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getTime() {
  return (dispatch, getState) => {
    const {
      filters: { day, time, notNow },
      events: { calendar, bounds }
    } = getState();

    emitter.emit("filters");

    if (!time.trim().length) {
      dispatch({
        type: "events/set",
        payload: {
          notNow,
          day,
          upNext: calendar.find(events => events.iso === day.iso).data
        }
      });
    } else {
      const expandedTime = detruncateTime(time);
      const searchTime = moment(`${day.title} ${expandedTime}`, "dddd h:mma");
      dispatch({
        type: "events/set",
        payload: {
          day: null,
          now: searchTime.valueOf()
        }
      });
      dispatch(get({ bounds, notNow }));
    }
  };
}

export const searchTimeSelector = state => {
  const day = state.events.day;
  if (day) {
    return day.title;
  }

  const now = state.events.now;
  const time = moment(now);
  const value = time.format("ddd h:mma");

  return value;
};

function getDaysAway(item) {
  const days = item._source.groupedHours[0].days.sort((a, b) => {
    return a.daysAway - b.daysAway;
  });

  let away = days[0].daysAway;

  const remaining = timeRemaining(
    item._source.groupedHours[0],
    item._source.groupedHours[0].iso
  );

  if (remaining.ended && days.length === 1) {
    away += 7;
  } else if (remaining.ended) {
    away = days[1].daysAway;
  }

  return away;
}

export function selectPlaceEvents(item) {
  return state => {
    return item &&
      item._source.placeid &&
      state.events.places[item._source.placeid]
      ? state.events.places[item._source.placeid]
          .map(id => state.events.data[id])
          .sort((_a, _b) => {
            const aAway = getDaysAway(_a);

            const bAway = getDaysAway(_b);

            if (aAway !== bAway) {
              return aAway - bAway;
            }

            const aStart = parseInt(_a._source.groupedHours[0].start, 10);
            const bStart = parseInt(_b._source.groupedHours[0].start, 10);

            if (aStart !== bStart) {
              return aStart - bStart;
            }

            return (
              _a._source.groupedHours[0].duration -
              _b._source.groupedHours[0].duration
            );
          })
          .sort((_a, _b) => {
            let a = 0;
            const aISO = makeYesterdayISO(_a._source.days);
            if (aISO) {
              const { ending: aEnding } = timeRemaining(
                _a._source.groupedHours[_a._source.groupedHours.length - 1],
                aISO
              );

              a = aEnding ? 1 : 0;
            }

            let b = 0;
            const bISO = makeYesterdayISO(_b._source.days);
            if (bISO) {
              const { ending: bEnding } = timeRemaining(
                _b._source.groupedHours[_b._source.groupedHours.length - 1],
                bISO
              );

              b = bEnding ? 1 : 0;
            }

            return b - a;
          })
      : [];
  };
}
