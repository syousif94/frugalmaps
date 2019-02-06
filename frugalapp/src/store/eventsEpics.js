import { Permissions } from "expo";
import { AsyncStorage } from "react-native";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";
import emitter from "tiny-emitter/instance";
import moment from "moment";
import _ from "lodash";
// import { AWSCF } from "../Constants";

import api from "../API";
import * as Events from "./events";
import * as Location from "./location";
import { groupHours } from "../Time";
import locate from "../Locate";

const sortDays = now => (a, b) => {
  let aStart = parseInt(a._source.groupedHours[0].start, 10);
  if (aStart > now) {
    aStart += 2400;
  }
  let bStart = parseInt(b._source.groupedHours[0].start, 10);
  if (bStart > now) {
    bStart += 2400;
  }

  let diff = aStart - bStart;

  if (diff === 0) {
    let aEnd = parseInt(a._source.groupedHours[0].end, 10);
    let bEnd = parseInt(b._source.groupedHours[0].end, 10);

    if (aEnd < aStart) {
      aEnd += 2400;
      if (aEnd < aStart) {
        aEnd += 2400;
      }
    }

    if (bEnd < bStart) {
      bEnd += 2400;
      if (bEnd < bStart) {
        bEnd += 2400;
      }
    }

    diff = aEnd - bEnd;
  }

  return diff;
};

const makeEvents = (hits, week = false) => {
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
        return day;
      })
      // .filter(day => day.data.length)
      .map((day, index) => {
        // day.data.groups = day.data.groups.map(group =>
        //   group.sort((a, b) => parseInt(a.start) - parseInt(b.start))
        // );
        day.data = day.data.sort(sortDays(timeInt));
        return { ...day, index };
      });

    return days;
  } else {
    const today = initial[todayIndex];
    today.title = "Today";
    today.data = today.data
      .filter(day => !day.sort || day.sort < 45)
      .sort(sortDays(timeInt));
    return [today, closest];
  }
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
        } else if (action.payload.recent) {
          body.recent = true;
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
            // doc._source.photos.forEach(photo => {
            //   Image.prefetch(`${AWSCF}${photo.thumb.key}`);
            // });
            const hit = _.cloneDeep(doc);
            hit._source.groupedHours = groupHours(hit._source);
            return hit;
          });

          AsyncStorage.setItem("oldData", JSON.stringify(hits));

          if (bounds !== undefined) {
            emitter.emit("fit-bounds", bounds);
          }

          const weeklyCalendar =
            action.payload.weekly || action.payload.queryType === "City";

          const calendar = makeEvents(hits, weeklyCalendar);

          let day;

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

            if (!day) {
              day = "All Events";
            }
          }

          return Observable.of(
            Location.actions.set({
              coordinates,
              lastQuery: text,
              text,
              bounds: action.payload.bounds ? undefined : null
            }),
            Events.actions.set({
              data: hits,
              refreshing: false,
              calendar,
              day,
              initialized: true
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

        const data = JSON.parse(dataStr);

        const calendar = makeEvents(data);

        return Events.actions.set({
          refreshing: true,
          queryType: null,
          data,
          calendar,
          initialized: true
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
