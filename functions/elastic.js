const elasticsearch = require("elasticsearch");

const es = new elasticsearch.Client({
  host: "http://es01:9200"
});

module.exports = es;
