const elasticsearch = require("elasticsearch");

const es = new elasticsearch.Client({
  host: `https://${process.env.APPBASE}@scalr.api.appbase.io/frugal-maps`
});

module.exports = es;
