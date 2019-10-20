require("dotenv").config();
require("isomorphic-fetch");
const AWS = require("../aws");
const s3 = new AWS.S3();
const _ = require("lodash");

async function getObjects(index) {
  const params = {
    Bucket: "buncha",
    Delimiter: "/",
    Prefix: `backup/${index}/`
  };

  const keys = await new Promise((resolve, reject) => {
    s3.listObjects(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Contents.map(doc => doc.Key));
      }
    });
  });

  const objects = await Promise.all(
    keys.map(key =>
      s3
        .getObject({ Bucket: "buncha", Key: key })
        .promise()
        .then(data => JSON.parse(data.Body.toString("utf-8")))
    )
  );

  // const objs = objects.map(obj => {
  //   const result = {
  //     ...obj,
  //     tags: getKeywords(obj)
  //   };

  //   delete result.type;

  //   return result;
  // });

  return objects;
}

function getKeywords(obj) {
  let keywords = [];

  keywords.push(obj.type.toLowerCase());
  keywords = [
    ...keywords,
    ...obj.title.toLowerCase().split(" "),
    ...obj.description.toLowerCase().split(" ")
  ];

  keywords = _.flatten(keywords.map(word => _.words(word)));

  const result = [];

  eventWords.map(words => {
    const hasWords = words.reduce((prev, val) => {
      return prev && !!keywords.find(word => word.indexOf(val) > -1);
    }, true);

    if (hasWords) {
      result.push(words.join(" "));
    }
  });

  return result;
}

const EVENT_TYPES = [
  "Food",
  "Nonalcoholic",
  "Happy Hour",
  "Club Meeting",
  "Brunch",
  "Karaoke",
  "Trivia",
  "Tacos",
  "Pizza",
  "Margs",
  "Mimosas",
  "Burgers",
  "Bingo",
  "Bowling",
  "Ping Pong",
  "Pool",
  "Board Games",
  "Comedy",
  "Open Mic",
  "Sports",
  "Live Music",
  "Sangria",
  "Beer",
  "Wine",
  "Wells",
  "Shots"
];

const eventWords = EVENT_TYPES.map(word => word.toLowerCase().split(" "));

async function transform() {
  const docs = await getObjects("events");

  const res = await fetch("https://frugal.ideakeg.xyz/api/bulk", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      index: "events",
      docs,
      postCode: process.env.POSTCODE
    })
  }).then(res => res.text());

  console.log(res);
}

transform();
