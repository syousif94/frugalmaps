import { Permissions, Location as ExpoLocation } from "expo";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";
import * as Events from "./events";
import * as Location from "./location";
import { defer } from "./lib";

const events = action$ =>
  action$
    .ofType(Events.types.set)
    .filter(action => action.payload.refreshing)
    .switchMap(() =>
      Observable.defer(async () => {
        let coordinates;

        let request;

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

        const res = await request;
        return { res, coordinates };
      })
        .switchMap(({ res, coordinates }) => {
          const searchText = res.text;
          const data = res.hits;
          return Observable.of(
            Location.actions.set({
              coordinates,
              searchText
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
