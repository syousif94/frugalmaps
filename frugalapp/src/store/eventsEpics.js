import { Permissions, Location as ExpoLocation } from "expo";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";
import * as Events from "./events";
import * as Location from "./location";

const events = action$ =>
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
        .switchMap(({ res, coordinates }) => {
          const text = res.text;
          const data = res.hits;
          return Observable.of(
            Location.actions.set({
              coordinates,
              text,
              bounds: action.payload.bounds ? undefined : null
            }),
            Events.actions.set({
              refreshing: false,
              data
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Events.actions.set({
            refreshing: false
          });
        })
    );

export default combineEpics(events);
