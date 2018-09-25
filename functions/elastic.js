const elasticsearch = require("elasticsearch");

const es = new elasticsearch.Client({
  host: process.env.AWSES
});

module.exports = es;
