const elastic = require("./elastic");
const location = require("./schema/location");

module.exports = function popularCities(req, res) {
  elastic.search({
    index: location.index,
    type: location.type,
    body: {
      query: {
        match_all: {}
      },
      size: 0,
      aggs: {
        cities: {
          terms: {
            field: "city",
            order: { _count: "desc" },
            size: 50
          }
        }
      },
      _source: false
    }
  }).then(results => {
    const cities = results.aggregations.cities.buckets.map(doc => ({
      text: doc.key,
      count: doc.doc_count
    }));

    res.send({
      cities: 
    })
  }).catch(err => {
    res.send({
      error: err.message
    })
  })
}