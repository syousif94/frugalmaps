require("dotenv").config();
require("isomorphic-fetch");

const client = require("../elastic");

es.
  .getMappings()
  .then(res => {
    console.log(res);
    return;
  })
  .catch(error => {
    console.log(error);
  });
