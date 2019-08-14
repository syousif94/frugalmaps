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

  return objects;
}

async function transform() {
  const docs = await getObjects("location").then(docs =>
    docs.map(doc => ({ ...doc, _id: _.kebabCase(doc.name) }))
  );

  console.log(docs[0]);

  const res = await fetch("https://frugal.ideakeg.xyz/api/bulk", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      index: "locations",
      docs,
      postCode: process.env.POSTCODE
    })
  }).then(res => res.text());

  console.log(res);
}

transform();
