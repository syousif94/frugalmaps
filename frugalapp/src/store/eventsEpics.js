import { Permissions } from "expo";
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

const makeEvents = hits => {
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

  const today = moment().weekday();

  const todayIndex = initial.findIndex(day => day.iso === today);

  // const todayAndAfter = initial.slice(todayIndex, 7);

  // const beforeToday = initial.slice(0, todayIndex);

  return [initial[todayIndex], closest];

  // return (
  //   [...todayAndAfter, ...beforeToday]
  //     .map((day, index) => {
  //       day.away = index;
  //       return day;
  //     })
  //     // .filter(day => day.data.length)
  //     .map((day, index) => ({ ...day, index }))
  // );
};

const events = (action$, store) =>
  action$
    .ofType(Events.types.set)
    .filter(action => action.payload.refreshing)
    .switchMap(action =>
      Observable.defer(async () => {
        let coordinates;

        let request;

        if (action.payload.bounds) {
          request = api("query-events", {
            bounds: action.payload.bounds
          });
        } else {
          const { status: locationStatus } = await Permissions.getAsync(
            Permissions.LOCATION
          );

          if (locationStatus === "granted") {
            const {
              coords: { latitude, longitude }
            } = await locate();

            coordinates = {
              latitude,
              longitude
            };

            request = api("query-events", {
              lat: latitude,
              lng: longitude
            });
          } else {
            request = api("query-events");
          }
        }

        const res = await request;
        return { res, coordinates };
      })
        .retry(2)
        .switchMap(({ res, coordinates }) => {
          const { text, hits: docs, bounds } = res;

          const hits = docs.map(doc => {
            const hit = _.cloneDeep(doc);
            hit._source.groupedHours = groupHours(hit._source);
            return hit;
          });

          if (bounds !== undefined) {
            emitter.emit("fit-bounds", bounds);
          }

          const calendar = makeEvents(hits);

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

export default combineEpics(events);
