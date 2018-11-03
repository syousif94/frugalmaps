import { Alert } from "react-native";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import api from "../API";
import { validateTime } from "../Time";

import * as Submission from "./submission";

const saveEvent = (action$, store) =>
  action$
    .ofType(Submission.types.set)
    .filter(action => action.payload.saving)
    .switchMap(action =>
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

        const invalid = new Error("Invalid");

        if (!place) {
          Alert.alert(
            "Missing Restaurant",
            "Please select a restaurant to proceed"
          );
          throw invalid;
        }

        if (!title.length) {
          Alert.alert("Missing Title", "Please name the event to proceed");
          throw invalid;
        }

        if (!description.length) {
          Alert.alert(
            "Missing Description",
            "Please add a short description to proceed"
          );
          throw invalid;
        }

        if (!days.length) {
          Alert.alert(
            "Missing Days",
            "Please select the days of the event to proceed"
          );
          throw invalid;
        }

        if (!eventType) {
          Alert.alert(
            "Missing Type",
            "Please select the event the event to proceed"
          );
          throw invalid;
        }

        if (startTime.length && !validateTime(startTime)) {
          Alert.alert(
            "Invalid Start Time",
            "Make sure the formatting is correct"
          );
          throw invalid;
        }

        if (endTime.length && !validateTime(endTime)) {
          Alert.alert(
            "Invalid End Time",
            "Make sure the formatting is correct"
          );
          throw invalid;
        }

        const payload = {
          placeid: place.eventType,
          title,
          description
        };

        const res = await api("save-event", payload);

        return { res };
      })
        .retry(2)
        .switchMap(({ res }) => {
          return Observable.of(
            Submission.actions.set({
              saving: false,
              id: null,
              eventType: "Happy Hour",
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

export default combineEpics(saveEvent);
