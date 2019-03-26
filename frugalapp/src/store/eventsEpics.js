import { Permissions } from "expo";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";
import emitter from "tiny-emitter/instance";
import _ from "lodash";

import api from "../API";
import * as Events from "./events";
import * as Location from "./location";
import { groupHours } from "../Time";
import locate from "../Locate";

const events = (action$, store) =>
  action$
    .ofType(Events.types.set)
    .filter(action => action.payload.refreshing)
    .switchMap(action =>
      Observable.defer(async () => {
        const body = {
          now: Date.now()
        };

        let coordinates;

        const { status: locationStatus } = await Permissions.getAsync(
          Permissions.LOCATION
        );

        if (locationStatus === "granted") {
          const {
            coords: { latitude, longitude }
          } = await locate();

          body.lat = latitude;
          body.lng = longitude;

          coordinates = {
            latitude,
            longitude
          };
        }

        if (action.payload.bounds) {
          body.bounds = action.payload.bounds;
        }

        const res = await api("events", body);

        return { res, coordinates };
      })
        .switchMap(({ res, coordinates }) => {
          const {
            bounds,
            city,
            markers,
            calendar,
            data,
            list,
            places,
            closest,
            newest: recent
          } = res;

          if (bounds !== undefined) {
            emitter.emit("fit-bounds", bounds);
          }

          let day = "Up Next";

          const {
            events: { day: storeDay }
          } = store.getState();

          if (calendar.length) {
            if (storeDay) {
              const storeDayData = calendar.find(
                data => data.title === storeDay
              );

              if (storeDayData) {
                day = storeDay;
              }
            }

            if (!day) {
              day = "Up Next";
            }
          }

          return Observable.of(
            Location.actions.set({
              text: city && city.text,
              coordinates,
              lastQuery: city && city.text,
              bounds: action.payload.bounds ? undefined : null
            }),
            Events.actions.set({
              list,
              data,
              places,
              refreshing: false,
              calendar,
              day,
              initialized: true,
              markers,
              closest,
              recent
            })
          );
        })
        .catch(error => {
          console.log({ events: error });
          return Observable.of(
            Events.actions.set({
              refreshing: false,
              initialized: true
            })
          );
        })
        .retry(2)
    );

const fetchSelected = action$ =>
  action$.ofType(Events.types.fetch).switchMap(action =>
    Observable.defer(async () => {
      const id = action.payload.id;
      const data = await api("fetch-event", { id }).then(res => {
        const hits = res.events.map(doc => {
          doc._source.photos = _(doc._source.photos)
            .shuffle()
            .value();
          const hit = _.cloneDeep(doc);
          hit._source.groupedHours = groupHours(hit._source);
          return hit;
        });

        return hits;
      });
      return data;
    })
      .switchMap(data => {
        const selectedEvent = data[0];

        return Observable.of(
          Events.actions.merge({
            data
          }),
          Events.actions.set({
            selectedEvent: {
              data: selectedEvent
            }
          })
        );
      })
      .catch(error => {
        console.log(error);
        return Observable.of(Events.actions.set({}));
      })
  );

// const reorder = (action$, store) =>
//   action$.ofType(Events.types.reorder).switchMap(() =>
//     Observable.defer(async () => {
//       try {
//         const dataStr = await AsyncStorage.getItem("oldData");

//         if (dataStr === null) {
//           return Events.actions.set({
//             reordering: false
//           });
//         }

//         let {
//           events: { data, recent }
//         } = store.getState();

//         const calendar = makeEvents(data, true, true);

//         const listData = makeListData(calendar);

//         const list = [
//           {
//             title: "Up Next",
//             data: listData
//           }
//         ];

//         let markerData = [{ title: "Up Next", data }, ...calendar];

//         if (recent) {
//           markerData = [...recent, ...markerData];
//         }

//         const markers = makeMarkers(markerData);
//         data = recent
//           ? _([...data, ...recent[0].data])
//               .uniqBy("_id")
//               .value()
//           : data;

//         return Events.actions.set({
//           reordering: false,
//           data,
//           list,
//           calendar,
//           markers,
//           recent
//         });
//       } catch (error) {
//         console.log(error);
//         return Events.actions.set({
//           reordering: false
//         });
//       }
//     })
//   );

// const restore = action$ =>
//   action$.ofType(Events.types.restore).switchMap(() =>
//     Observable.defer(async () => {
//       try {
//         const dataStr = await AsyncStorage.getItem("oldData");

//         if (dataStr === null) {
//           return Events.actions.set({
//             refreshing: true,
//             queryType: null
//           });
//         }

//         let data;

//         let recent;

//         const value = JSON.parse(dataStr);

//         if (Array.isArray(value)) {
//           data = value;
//         } else {
//           data = value.hits;
//           recent = value.recent;
//         }

//         const calendar = makeEvents(data, true, true);

//         if (!calendar.length) {
//           return Events.actions.set({
//             refreshing: true
//           });
//         }

//         const listData = makeListData(calendar);

//         const list = [
//           {
//             title: "Up Next",
//             data: listData
//           }
//         ];

//         let markerData = [{ title: "Up Next", data }, ...calendar];

//         if (recent) {
//           markerData = [...recent, ...markerData];
//         }

//         const markers = makeMarkers(markerData);
//         data = recent
//           ? _([...data, ...recent[0].data])
//               .uniqBy("_id")
//               .value()
//           : data;

//         return Events.actions.set({
//           refreshing: true,
//           queryType: null,
//           data,
//           list,
//           calendar,
//           markers,
//           initialized: true,
//           recent
//         });
//       } catch (error) {
//         console.log(error);
//         return Events.actions.set({
//           refreshing: true,
//           queryType: null
//         });
//       }
//     })
//   );

export default combineEpics(events, fetchSelected);
