const _ = require("lodash");
const elastic = require("../elastic");
const location = require("../schema/location");
const event = require("../schema/event");

module.exports = function popularCities(req, res) {
  const { lat, lng } = req.body;

  let body = [
    { index: event.index },
    {
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
  ];

  if (lat && lng) {
    body = [
      ...body,
      { index: location.index },
      {
        query: {
          match_all: {}
        },
        sort: [
          {
            _geo_distance: {
              coordinates: [lng, lat],
              unit: "mi",
              order: "asc",
              distance_type: "plane"
            }
          }
        ],
        size: 5
      }
    ];
  }

  let popular;
  let nearby;

  elastic
    .msearch({
      body
    })
    .then(res => res.responses)
    .then(results => {
      popular = results[0].aggregations.cities.buckets.map(doc => ({
        text: doc.key,
        count: doc.doc_count
      }));

      if (lat && lng) {
        nearby = results[1].hits.hits;
      }

      return elastic.mget({
        index: location.index,
        type: location.type,
        body: {
          ids: popular.map(city => _.kebabCase(city.text))
        }
      });
    })
    .then(results => {
      popular = results.docs.map((doc, index) => {
        doc._source.count = popular[index].count;
        return doc;
      });

      res.send({
        popular,
        nearby
      });
    })
    .catch(err => {
      res.send({
        error: err.message
      });
    });
};
