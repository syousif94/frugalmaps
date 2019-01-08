import store from "./store";
import * as Submissions from "./store/submissions";
const firebase = require("firebase");
require("firebase/firestore");

var config = {
  apiKey: "AIzaSyCMw-fDD28DLB0eWIR6PJQrDQfArisLvjw",
  authDomain: "frugalmaps.firebaseapp.com",
  databaseURL: "https://frugalmaps.firebaseio.com",
  projectId: "frugalmaps",
  storageBucket: "frugalmaps.appspot.com",
  messagingSenderId: "279259204952"
};
firebase.initializeApp(config);

export const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

db.collection("submissions").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      store.dispatch(
        Submissions.actions.set({
          newData: [{ ...change.doc.data(), id: change.doc.id }]
        })
      );
    }
  });
});
