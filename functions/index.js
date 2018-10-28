const functions = require("firebase-functions");

require("dotenv").config();
require("isomorphic-fetch");

const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("FrugalMaps API says hi");
});

app.post("/places/suggest", require("./places/suggest"));
app.post("/places/popular", require("./places/popular"));
app.post("/places/reverse", require("./places/reverse"));

app.post("/save-event", require("./saveEvent"));
app.post("/query-events", require("./queryEvents"));
app.post("/delete-event", require("./deleteEvent"));

// app.post("/events/published", require("./events/published"));
// app.post("/events/submissions", require("./events/submissions"));

// not as clean, but a better endpoint to consume
const api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`; // prepend '/' to keep query params if any
  }
  return app(request, response);
});

module.exports = { api };
