import { Permissions } from "expo";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";
import * as Location from "./location";
import { defer } from "./lib";
import locate from "../Locate";

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
          const text = action.payload.text;

          let query = `input=${text}&types=(cities)`;

          const {
            location: { coordinates }
          } = store.getState();

          if (coordinates) {
            const { latitude, longitude } = coordinates;
            const locationQuery = `&location=${latitude},${longitude}&radius=10000`;
            query = `${query}${locationQuery}`;
          }

          const res = await api("places/suggest", {
            query
          });

          const completions = res.values.filter(val => val && val.name);

          return Location.actions.set({
            completions
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
            popular = res.popular.filter(val => val && val._source.name);
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
