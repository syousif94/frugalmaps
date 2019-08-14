const _ = require("lodash");
const elastic = require("../elastic");
const location = require("../schema/location");
const event = require("../schema/event");

module.exports = async function popularCities(req, res) {
  const { lat, lng } = req.body;

  try {
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

    const hasLocation = lat && lng;

    if (hasLocation) {
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
          size: 50
        }
      ];
    }

    let popular = [];
    let nearby = [];

    let results = await elastic
      .msearch({
        body
      })
      .then(res => res.responses);

    popular = results[0].aggregations.cities.buckets.map(doc => ({
      text: doc.key,
      count: doc.doc_count
    }));

    if (hasLocation) {
      nearby = results[1].hits.hits;
    }

    results = await elastic.mget({
      index: location.index,
      body: {
        ids: popular.map(city => _.kebabCase(city.text))
      }
    });

    popular = results.docs.map((doc, index) => {
      doc._source.count = popular[index].count;
      return doc;
    });

    const allCities = hasLocation ? [...popular, ...nearby] : popular;

    const uniqueCities = _.uniqBy(allCities, doc => doc._id);

    const boundsBodies = _(uniqueCities)
      .map(doc => {
        const { northeast, southwest } = doc._source.bounds;

        const coordinates = {
          top_left: [southwest.lng, northeast.lat],
          bottom_right: [northeast.lng, southwest.lat]
        };

        return [
          { index: event.index },
          {
            query: {
              bool: {
                must: [{ match_all: {} }],
                filter: {
                  geo_bounding_box: {
                    coordinates
                  }
                }
              }
            },
            _source: false
          }
        ];
      })
      .flatten()
      .value();

    const boundsResults = await elastic
      .msearch({
        body: boundsBodies
      })
      .then(res => res.responses);

    const keyedCities = _(boundsResults)
      .map((res, index) => {
        return {
          id: uniqueCities[index]._id,
          count: res.hits.total.value
        };
      })
      .keyBy("id")
      .value();

    const removeEmpty = doc => keyedCities[doc._id].count;
    const insertCount = doc => {
      doc._source.count = keyedCities[doc._id].count;
      return doc;
    };

    popular = popular.filter(removeEmpty).map(insertCount);
    if (hasLocation) {
      nearby = nearby.filter(removeEmpty).map(insertCount);
    }

    res.send({
      popular,
      nearby
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
