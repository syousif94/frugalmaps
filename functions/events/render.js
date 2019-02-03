const functions = require("firebase-functions");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const Handlebars = require("handlebars");

const source = fs.readFileSync(`${__dirname}/event.html`, "utf8").toString();
const eventTemplate = Handlebars.compile(source);

const AWSCF = "https://dwrg27ehb8gnf.cloudfront.net/";
const API_URL = `https://us-central1-frugalmaps.cloudfunctions.net/api/fetch-event`;

function parse(response) {
  const { events } = response;

  const {
    _id: id,
    _source: { location, photos, city, address, website, phone, url }
  } = events[0];

  const thumbURL = `${AWSCF}${photos[0].mid.key}`;

  const eventCount = `${events.length} event${events.length > 1 ? "s" : ""}`;

  const description = `${location} · ${city} · ${eventCount}`;

  return {
    location,
    id,
    city,
    eventCount,
    address,
    website,
    thumbURL,
    description,
    phone,
    url
  };
}

module.exports = functions.https.onRequest(async (req, res) => {
  const id = req.path.split("e/")[1];

  if (!id) {
    res.sendStatus(404);
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id
    })
  }).then(res => res.json());

  const data = parse(response);

  res.send(eventTemplate(data));
});
