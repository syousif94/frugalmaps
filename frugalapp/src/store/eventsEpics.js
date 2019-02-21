import { Permissions } from "expo";
import { AsyncStorage } from "react-native";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";
import emitter from "tiny-emitter/instance";
import moment from "moment";
import _ from "lodash";

import api from "../API";
import * as Events from "./events";
import * as Location from "./location";
import { groupHours } from "../Time";
import locate from "../Locate";

const sortDays = (now, away) => (a, b) => {
  let aStart = parseInt(a._source.groupedHours[0].start, 10);
  let aEnd = parseInt(a._source.groupedHours[0].end, 10);

  if (aEnd < aStart) {
    aEnd += 2400;
  }

  if (!away && aEnd < now) {
    aStart += 2400;
    aEnd += 2400;
  }

  let bStart = parseInt(b._source.groupedHours[0].start, 10);
  let bEnd = parseInt(b._source.groupedHours[0].end, 10);

  if (bEnd < bStart) {
    bEnd += 2400;
  }

  if (!away && bEnd < now) {
    bStart += 2400;
    bEnd += 2400;
  }

  let diff;

  const bothNow =
    !away && (aStart <= now && aEnd > now && bStart <= now && bEnd > now);

  const sameStart = aStart === bStart;

  if (bothNow || sameStart) {
    diff = aEnd - bEnd;
  } else {
    diff = aStart - bStart;
  }

  return diff;
};

const makeEvents = (hits, week = false, nearest = false) => {
  const initial = [
    { title: "Monday", data: [], iso: 1, away: 0 },
    { title: "Tuesday", data: [], iso: 2, away: 0 },
    { title: "Wednesday", data: [], iso: 3, away: 0 },
    { title: "Thursday", data: [], iso: 4, away: 0 },
    { title: "Friday", data: [], iso: 5, away: 0 },
    { title: "Saturday", data: [], iso: 6, away: 0 },
    { title: "Sunday", data: [], iso: 0, away: 0 }
  ];

  const closest = {
    title: "Closest",
    data: _.uniqBy(hits, "_source.placeid"),
    iso: 0,
    away: 0
  };

  if (!hits) {
    return initial;
  }

  hits.forEach(hit => {
    hit._source.days.forEach(day => {
      initial[day].data.push(hit);
    });
  });

  const now = moment();

  const today = now.weekday();

  const todayIndex = initial.findIndex(day => day.iso === today);

  const timeInt = parseInt(now.format("HHmm"), 10);

  if (week) {
    const todayAndAfter = initial.slice(todayIndex, 7);

    const beforeToday = initial.slice(0, todayIndex);

    const days = [...todayAndAfter, ...beforeToday]
      .map((day, index) => {
        day.away = index;
        if (nearest) {
          day.data = day.data.filter(day => !day.sort || day.sort < 45);
        }
        day.data = day.data.sort(sortDays(timeInt, index));
        return { ...day, index };
      })
      .filter(day => day.data.length);

    return days;
  } else {
    const today = initial[todayIndex];
    today.title = "Today";
    if (nearest) {
      today.data = today.data.filter(day => !day.sort || day.sort < 45);
    }
    today.data = today.data.sort(sortDays(timeInt));
    return [today, closest];
  }
};

const makeMarkers = (days, bounds) => {
  return _(days)
    .map(day => {
      const clone = _.cloneDeep(day);
      clone.data = _(day.data)
        .groupBy(hit => hit._source.placeid)
        .map(events => {
          return {
            _id: events[0]._id,
            type: "group",
            _source: events[0]._source,
            events
          };
        })
        .filter(events => {
          if (!bounds) return true;

          const [lng, lat] = events._source.coordinates;

          return (
            lng <= bounds.northeast.lng &&
            lng >= bounds.southwest.lng &&
            lat >= bounds.southwest.lat &&
            lat <= bounds.northeast.lat
          );
        })
        .value();
      return clone;
    })
    .value();
};

const events = (action$, store) =>
  action$
    .ofType(Events.types.set)
    .filter(action => action.payload.refreshing)
    .switchMap(action =>
      Observable.defer(async () => {
        const body = {};

        let coordinates;

        const { status: locationStatus } = await Permissions.getAsync(
          Permissions.LOCATION
        );

        if (locationStatus === "granted") {
          const {
            coords: { latitude, longitude }
          } = await locate();

          body.lat = latitude;
          body.lng = longitude;

          coordinates = {
            latitude,
            longitude
          };
        }

        if (action.payload.bounds) {
          body.bounds = action.payload.bounds;
        }

        const res = await api("query-events", body);

        return { res, coordinates };
      })
        .retry(2)
        .switchMap(({ res, coordinates }) => {
          const { text, hits: docs, bounds } = res;

          const hits = docs.map(doc => {
            doc._source.photos = _(doc._source.photos)
              .shuffle()
              .value();

            const hit = _.cloneDeep(doc);
            hit._source.groupedHours = groupHours(hit._source);
            return hit;
          });

          let recent;

          if (res.recent) {
            recent = [
              {
                title: "Newest",
                data: res.recent.map(doc => {
                  doc._source.photos = _(doc._source.photos)
                    .shuffle()
                    .value();
                  doc._source.groupedHours = groupHours(doc._source);
                  return doc;
                })
              }
            ];
          }

          const cityQuery = action.payload.queryType === "City";

          const nearestQuery = !action.payload.bounds && !cityQuery;

          if (nearestQuery) {
            AsyncStorage.setItem("oldData", JSON.stringify({ hits, recent }));
          }

          const list = makeEvents(hits, false, nearestQuery);

          const calendar = makeEvents(hits, true, nearestQuery);

          let markerData = [{ title: "All", data: hits }, ...calendar];

          if (recent) {
            markerData = [...recent, ...markerData];
          }

          const markers = makeMarkers(markerData, bounds);

          let day = calendar[0].title;

          if (action.payload.bounds && !cityQuery) {
            const {
              events: { day: storeDay }
            } = store.getState();

            if (calendar.length) {
              if (storeDay) {
                const storeDayData = calendar.find(
                  data => data.title === storeDay
                );

                if (storeDayData) {
                  day = storeDay;
                }
              }
            }
          }

          if (bounds !== undefined) {
            emitter.emit("fit-bounds", bounds);
          }

          const data = recent
            ? _([...hits, ...recent[0].data])
                .uniqBy("_id")
                .value()
            : hits;

          return Observable.of(
            Location.actions.set({
              coordinates,
              lastQuery: text,
              text,
              bounds: action.payload.bounds ? undefined : null
            }),
            Events.actions.set({
              list,
              data,
              refreshing: false,
              calendar,
              day,
              initialized: true,
              markers,
              recent
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(
            Events.actions.set({
              refreshing: false,
              initialized: true
            })
          );
        })
    );

const fetchSelected = action$ =>
  action$.ofType(Events.types.fetch).switchMap(action =>
    Observable.defer(async () => {
      const id = action.payload.id;
      const data = await api("fetch-event", { id }).then(res => {
        const hits = res.events.map(doc => {
          doc._source.photos = _(doc._source.photos)
            .shuffle()
            .value();
          const hit = _.cloneDeep(doc);
          hit._source.groupedHours = groupHours(hit._source);
          return hit;
        });

        return hits;
      });
      return data;
    })
      .switchMap(data => {
        const selectedEvent = data[0];

        return Observable.of(
          Events.actions.merge({
            data
          }),
          Events.actions.set({
            selectedEvent: {
              data: selectedEvent
            }
          })
        );
      })
      .catch(error => {
        console.log(error);
        return Observable.of(Events.actions.set({}));
      })
  );

const restore = action$ =>
  action$.ofType(Events.types.restore).switchMap(() =>
    Observable.defer(async () => {
      try {
        const dataStr = await AsyncStorage.getItem("oldData");

        if (dataStr === null) {
          return Events.actions.set({
            refreshing: true,
            queryType: null
          });
        }

        let data;

        let recent;

        const value = JSON.parse(dataStr);

        if (Array.isArray(value)) {
          data = value;
        } else {
          data = value.hits;
          recent = value.recent;
        }

        const list = makeEvents(data, false, true);

        const calendar = makeEvents(data, true, true);

        const day = calendar[0].title;

        let markerData = [{ title: "All", data }, ...calendar];

        if (recent) {
          markerData = [...recent, ...markerData];
        }

        const markers = makeMarkers(markerData);
        data = recent
          ? _([...data, ...recent[0].data])
              .uniqBy("_id")
              .value()
          : data;

        return Events.actions.set({
          refreshing: true,
          queryType: null,
          data,
          list,
          calendar,
          markers,
          initialized: true,
          recent,
          day
        });
      } catch (error) {
        console.log(error);
        return Events.actions.set({
          refreshing: true,
          queryType: null
        });
      }
    })
  );

export default combineEpics(events, restore, fetchSelected);
