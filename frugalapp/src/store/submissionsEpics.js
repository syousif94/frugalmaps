import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";

import * as Submissions from "./submissions";

const getRestaurants = (action$, store) =>
  action$
    .ofType(Submissions.types.set)
    .filter(action => action.payload.refreshing);

const getSubmissions = (action$, store) =>
  action$
    .ofType(Submissions.types.set)
    .filter(action => action.payload.refreshing)
    .flatMap(action =>
      Observable.defer(async () => {
        const payload = {};

        const res = await api("save-event", payload);

        return { res };
      })
        .retry(2)
        .switchMap(({ res }) => {
          return Observable.of(Submissions.actions.set({}));
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(Submissions.actions.set({}));
        })
    );

export default combineEpics(getSubmissions, getRestaurants);
