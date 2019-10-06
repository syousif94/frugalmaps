import { combineReducers } from "redux";
import api from "../utils/API";
import moment from "moment";
import { makeState } from "./reducers";
import locate from "../utils/Locate";
import { groupHours, makeYesterdayISO, timeRemaining } from "../utils/Time";
import { WEB, DEV, IOS, ANDROID } from "../utils/Constants";
import emitter from "tiny-emitter/instance";

const makeReducer = makeState("events");

const refreshing = makeReducer("refreshing", false);
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
const selected = makeReducer("selected", null);
const day = makeReducer("day", null, {
  set: (state, payload) => {
    if (state === payload) {
      return null;
    }
    return payload;
  }
});

const data = makeReducer(
  "data",
  {},
  {
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
  day,
  tags,
  now
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
          }
        }
      });
      dispatch(refresh(city._source.bounds));
    } catch (error) {}
  };
}

export function refresh(bounds = null) {
  return dispatch => {
    dispatch({
      type: "events/set",
      payload: {
        now: Date.now()
      }
    });
    dispatch(get(bounds));
  };
}

export function get(bounds = null) {
  return async (dispatch, getState) => {
    dispatch({
      type: "events/set",
      payload: {
        refreshing: true,
        city: bounds ? undefined : null,
        bounds,
        upNext: WEB ? [] : undefined,
        tags: [],
        selected: null,
        error: null
      }
    });

    const {
      permissions: { location: locationEnabled },
      events: { now }
    } = getState();

    const time = moment(now);
    const body = {
      now,
      utc: time.utcOffset()
    };

    if (locationEnabled) {
      const {
        coords: { latitude, longitude }
      } = await locate();

      body.lat = latitude;
      body.lng = longitude;
    }

    if (bounds) {
      if (IOS || ANDROID) {
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

      if (res.empty) {
        const error =
          city && city.text
            ? `We don't have any event data for ${city.text} yet.`
            : `We can't determine your location`;
        dispatch({
          type: "events/set",
          payload: {
            refreshing: false,
            upNext: [],
            calendar: [],
            closest: [],
            newest: [],
            tags: [],
            error,
            city
          }
        });
        return;
      }

      if (bounds && IOS) {
        await new Promise(resolve => {
          setTimeout(resolve, 2000);
        });
      }

      dispatch({
        type: "events/set",
        payload: {
          refreshing: false,
          upNext: res.list[0].data,
          calendar: res.calendar,
          closest: res.closest ? res.closest[0].data : [],
          newest: res.newest[0].data,
          places: res.places,
          city,
          markers: res.markers[0].data,
          bounds: res.bounds,
          data: res.data,
          tags: res.tags
        }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "events/set",
        payload: {
          refreshing: false,
          error: error
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

export function selectPlaceEvents(item) {
  return state => {
    return item && item._source.placeid
      ? state.events.places[item._source.placeid]
          .map(id => state.events.data[id])
          .sort((_a, _b) => {
            const aDay = _a._source.groupedHours[0].days.sort((a, b) => {
              return a.daysAway - b.daysAway;
            })[0];

            let aAway = aDay.daysAway;

            const aRemaining = timeRemaining(
              _a._source.groupedHours[0],
              _a._source.groupedHours[0].iso
            );

            if (aRemaining.ended) {
              aAway += 7;
            }

            const bDay = _b._source.groupedHours[0].days.sort((a, b) => {
              return a.daysAway - b.daysAway;
            })[0];

            let bAway = bDay.daysAway;

            const bRemaining = timeRemaining(
              _b._source.groupedHours[0],
              _b._source.groupedHours[0].iso
            );

            if (bRemaining.ended) {
              bAway += 7;
            }

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
