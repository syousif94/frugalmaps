import store from "./store";
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
