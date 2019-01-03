import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";

import * as Submissions from "./submissions";

const getRestaurants = (action$, store) =>
  action$
    .ofType(Submissions.types.set)
    .filter(({ payload: { filter } }) => filter && filter.length)
    .debounceTime(50)
    .mergeMap(action =>
      Observable.defer(async () => {
        try {
          const text = action.payload.filter;

          let query = `input=${text}&types=establishment`;

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

          return Submissions.actions.set({
            restaurants: res.values
          });
        } catch (error) {
          console.log({ completions: error });
        }
      })
    )
    .filter(action => action);

const suggesting = (action$, store) =>
  action$
    .ofType(Submissions.types.set)
    .filter(({ payload: { filter } }) => filter && filter.length)
    .switchMap(() =>
      action$
        .ofType(Submissions.types.set)
        .filter(({ payload: { restaurants } }) => restaurants)
    )
    .map(() =>
      Submissions.actions.set({
        suggesting: false
      })
    );

const getSubmissions = (action$, store) =>
  action$
    .ofType(Submissions.types.set)
    .filter(action => action.payload.refreshing)
    .flatMap(() =>
      Observable.defer(async () => {
        const res = await api("events/submissions");

        return { res };
      })
        .switchMap(({ res }) => {
          return Observable.of(
            Submissions.actions.set({
              refreshing: false,
              data: res.submissions
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(
            Submissions.actions.set({
              refreshing: false
            })
          );
        })
    );

export default combineEpics(getRestaurants, suggesting, getSubmissions);
