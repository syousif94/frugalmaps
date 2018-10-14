import { Permissions, Location as ExpoLocation } from "expo";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";
import emitter from "tiny-emitter/instance";
import moment from "moment";

import api from "../API";
import * as Events from "./events";
import * as Location from "./location";

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
            } = await ExpoLocation.getCurrentPositionAsync({
              enableHighAccuracy: false
            });

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
          const { text, hits, bounds } = res;

          if (bounds !== undefined) {
            emitter.emit("fit-bounds", bounds);
          }

          const data = makeEvents(hits);

          let day;

          const {
            events: { day: storeDay }
          } = store.getState();

          let today = moment().format("dddd");

          if (data.length) {
            if (storeDay) {
              const storeDayData = data.find(data => data.title === storeDay);

              if (storeDayData) {
                day = storeDay;
              }
            }

            const todayData = data.find(data => data.title === today);

            if (todayData) {
              day = today;
            }

            if (!day) {
              day = data[0].title;
            }
          }

          return Observable.of(
            Location.actions.set({
              coordinates,
              text,
              bounds: action.payload.bounds ? undefined : null
            }),
            Events.actions.set({
              refreshing: false,
              data,
              day
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(
            Events.actions.set({
              refreshing: false
            })
          );
        })
    );

export default combineEpics(events);
