import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";

import * as Published from "./published";

const getCount = action$ =>
  action$
    .ofType(Published.types.count)
    .flatMap(() =>
      Observable.defer(async () => {
        const res = await api("events/published/count");

        return { res };
      })
        .retry(2)
        .switchMap(({ res }) => {
          return Observable.of(
            Published.actions.set({
              count: res.count
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
        })
    )
    .filter(action => action);

const getPublished = action$ =>
  action$
    .ofType(Published.types.set)
    .filter(action => action.payload.refreshing)
    .flatMap(() =>
      Observable.defer(async () => {
        const res = await api("events/published");

        return { res };
      })
        .switchMap(({ res }) => {
          return Observable.of(
            Published.actions.set({
              refreshing: false,
              data: res.published
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(
            Published.actions.set({
              refreshing: false
            })
          );
        })
        .retry(2)
    );

export default combineEpics(getPublished, getCount);
