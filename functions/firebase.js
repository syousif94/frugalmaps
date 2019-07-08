const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://frugalmaps.firebaseio.com"
});

const db = admin.firestore();

module.exports = {
  db
};
