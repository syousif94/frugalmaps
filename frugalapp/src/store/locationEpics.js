import { Permissions } from "expo";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";
import * as Location from "./location";
import { defer } from "./lib";
import locate from "../Locate";
import { groupHours } from "../Time";

const coordinates = action$ =>
  action$
    .ofType(Location.types.coordinates)
    .switchMap(
      defer(async () => {
        try {
          const { status: locationStatus } = await Permissions.getAsync(
            Permissions.LOCATION
          );

          if (locationStatus !== "granted") {
            return;
          }

          const {
            coords: { latitude, longitude }
          } = await locate();

          return Location.actions.set({
            coordinates: {
              latitude,
              longitude
            }
          });
        } catch (error) {
          console.log({ location: error });
        }
      })
    )
    .filter(action => action);

const completions = (action$, store) =>
  action$
    .ofType(Location.types.set)
    .filter(action => action.payload.text && action.payload.text.length)
    .debounceTime(50)
    .mergeMap(action =>
      Observable.defer(async () => {
        try {
          const input = action.payload.text;

          const body = {
            input
          };

          const {
            location: { coordinates }
          } = store.getState();

          if (coordinates) {
            const { latitude: lat, longitude: lng } = coordinates;
            body.lat = lat;
            body.lng = lng;
          }

          const res = await api("events/suggest", body);

          return Location.actions.set({
            completions: res.events.map(event => {
              event._source.groupedHours = groupHours(event._source);
              return event;
            })
          });
        } catch (error) {
          console.log({ completions: error });
        }
      })
    )
    .filter(action => action);

const suggestions = (action$, store) =>
  action$
    .ofType(Location.types.set)
    .filter(action => action.payload.focused || action.payload.coordinates)
    .switchMap(
      defer(async () => {
        try {
          const {
            location: { coordinates }
          } = store.getState();

          let request;

          if (coordinates) {
            const { latitude: lat, longitude: lng } = coordinates;
            request = api("places/popular", { lat, lng });
          } else {
            request = api("places/popular");
          }

          const res = await request;

          let popular = [];
          let closest = [];

          if (res.nearby && res.nearby.length) {
            closest = res.nearby.filter(val => val && val._source.name);
          }

          if (res.popular && res.popular.length) {
            popular = res.popular
              .filter(val => val && val._source.name)
              .sort((a, b) => b._source.count - a._source.count);
          }

          return Location.actions.set({
            closest,
            popular
          });
        } catch (error) {
          console.log({ completions: error });
        }
      })
    )
    .filter(action => action);

export default combineEpics(coordinates, completions, suggestions);
