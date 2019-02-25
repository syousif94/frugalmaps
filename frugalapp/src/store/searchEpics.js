import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";
import * as Search from "./search";
import { groupHours } from "../Time";

const completions = (action$, store) =>
  action$
    .ofType(Search.types.set)
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

          return Search.actions.set({
            results: res.events.map(event => {
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

export default combineEpics(completions);
