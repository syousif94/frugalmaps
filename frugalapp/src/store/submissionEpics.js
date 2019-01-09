import { Alert } from "react-native";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";

import * as Submission from "./submission";
import * as Published from "./published";

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

const deleteEvent = (action$, store) =>
  action$
    .ofType(Submission.types.set)
    .filter(action => action.payload.deleting === true)
    .switchMap(() =>
      Observable.defer(async () => {
        const {
          submission: { id, postCode }
        } = store.getState();

        const payload = {
          id,
          postCode
        };

        await api("delete-event", payload);
      })
        .switchMap(() => {
          const {
            submission: { id },
            published: { data: oldData }
          } = store.getState();

          const data = oldData.filter(item => item._id !== id);

          return Observable.of(
            Submission.actions.reset(),
            Published.actions.set({
              data
            })
          );
        })
        .catch(error => {
          if (error === "Invalid Post Code") {
            Alert.alert(
              "Invalid Code",
              "An admin code is required to perform this action"
            );
          }
          return Observable.of(
            Submission.actions.set({
              deleting: false
            })
          );
        })
    );

const saveEvent = (action$, store) =>
  action$
    .ofType(Submission.types.set)
    .filter(action => action.payload.saving === true)
    .switchMap(() =>
      Observable.defer(async () => {
        const {
          submission: {
            id,
            fid,
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
          title: title.trim(),
          description: description.trim(),
          days,
          type: eventType,
          id,
          fid,
          start: startTime.length ? startTime.trim() : null,
          end: endTime.length ? endTime.trim() : null,
          postCode: postCode.trim().length ? postCode : ""
        };

        const res = await api("save-event", payload);

        return { res };
      })
        .switchMap(({ res }) => {
          const {
            published: { data: oldData }
          } = store.getState();

          const data = [res, ...oldData.filter(item => item._id !== res._id)];

          return Observable.of(
            Submission.actions.reset(),
            Published.actions.set({
              data
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          if (error === "Invalid Code") {
            Alert.alert(
              "Invalid Code",
              "An admin code is required to perform this action"
            );
          }
          return Observable.of(
            Submission.actions.set({
              saving: false
            })
          );
        })
    );

export default combineEpics(deleteEvent, saveEvent, getPlace);
