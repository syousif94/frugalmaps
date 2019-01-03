import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";

import * as Submission from "./submission";

const getPlace = action$ =>
  action$
    .ofType(Submission.types.set)
    .filter(action => action.payload.placeid && !action.payload.place)
    .switchMap(action =>
      Observable.defer(async () => {
        const {
          payload: { placeid }
        } = action;
        const payload = {
          placeid
        };
        try {
          const res = await api("places/id", payload);
          return Submission.actions.set({
            place: res.restaurant
          });
        } catch (error) {
          console.log(error);
        }
      })
    )
    .filter(action => action);

const saveEvent = (action$, store) =>
  action$
    .ofType(Submission.types.set)
    .filter(action => action.payload.saving === true)
    .switchMap(() =>
      Observable.defer(async () => {
        const {
          submission: {
            id,
            eventType,
            title,
            description,
            startTime,
            endTime,
            postCode,
            place,
            days
          }
        } = store.getState();

        const payload = {
          placeid: place.place_id,
          title,
          description,
          days,
          type: eventType,
          id,
          start: startTime.length ? startTime : null,
          end: endTime.length ? endTime : null,
          postCode: postCode.trim().length ? postCode : null
        };

        const res = await api("save-event", payload);

        return { res };
      })
        .retry(2)
        .switchMap(({ res }) => {
          return Observable.of(
            Submission.actions.set({
              saving: false,
              fid: null,
              id: null,
              eventType: null,
              title: "",
              description: "",
              startTime: "",
              endTime: "",
              place: null,
              days: []
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(
            Submission.actions.set({
              saving: false
            })
          );
        })
    );

export default combineEpics(saveEvent, getPlace);
