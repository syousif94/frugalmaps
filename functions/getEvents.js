const elastic = require("./elastic");
const event = require("./schema/event");
const servicesApi = require("./google");
const turf = require("@turf/turf");
const _ = require("lodash");
const moment = require("moment");
const popularTags = require("./events/popularTags");
const { groupHours, makeEvents, makeMarkers, makeListData } = require("./time");

module.exports = async function getEvents(req, res) {
  const { lat, lng, now, text = "", tags = [], utc } = req.body;

  let city;

  try {
    const currentTime = moment(now).utcOffset(utc);

    let { bounds } = req.body;

    const body = {
      query: {
        bool: {
          must: [
            {
              match_all: {}
            }
          ]
        }
      },
      size: 100
    };

    if (lat && lng) {
      const sort = {
        _geo_distance: {
          coordinates: [lng, lat],
          order: "asc",
          unit: "mi",
          distance_type: "plane"
        }
      };
      body.sort = [sort];
    }

    if (bounds) {
      const { northeast, southwest } = bounds;

      const coordinates = {
        top_left: [southwest.lng, northeast.lat],
        bottom_right: [northeast.lng, southwest.lat]
      };

      body.query = {
        bool: {
          must: [{ match_all: {} }],
          filter: {
            geo_bounding_box: {
              coordinates
            }
          }
        }
      };
    } else if (lat && lng) {
      body.query = {
        bool: {
          must: [{ match_all: {} }],
          filter: {
            geo_distance: {
              distance: "45mi",
              coordinates: [lng, lat]
            }
          }
        }
      };

      city = await getCity(lat, lng);
    }

    if (tags.length || text.length) {
      body.query.bool.must = [];
    }

    if (text.length) {
      body.query.bool.must.push({
        bool: {
          should: [
            {
              multi_match: {
                query: text,
                type: "cross_fields",
                fields: ["title", "description", "location"],
                operator: "and"
              }
            },
            {
              match: {
                title: {
                  query: text,
                  fuzziness: "AUTO",
                  operator: "AND"
                }
              }
            },
            {
              match: {
                description: {
                  query: text,
                  fuzziness: "AUTO",
                  operator: "AND"
                }
              }
            },
            {
              match: {
                location: {
                  query: text,
                  fuzziness: "AUTO",
                  operator: "AND"
                }
              }
            },
            {
              match_bool_prefix: {
                title: {
                  query: text,
                  fuzziness: "AUTO",
                  operator: "AND"
                }
              }
            },
            {
              match_bool_prefix: {
                description: {
                  query: text,
                  fuzziness: "AUTO",
                  operator: "AND"
                }
              }
            },
            {
              match_bool_prefix: {
                location: {
                  query: text,
                  fuzziness: "AUTO",
                  operator: "AND"
                }
              }
            },
            {
              fuzzy: {
                tags: {
                  value: text
                }
              }
            },
            {
              prefix: {
                tags: text
              }
            },
            {
              bool: {
                must: text.split(" ").map(value => ({
                  term: {
                    value
                  }
                }))
              }
            }
          ]
        }
      });
    } else if (tags.length) {
      body.query.bool.must.push({
        terms: {
          tags
        }
      });
    }

    const data = await elastic
      .search({
        index: event.index,
        type: event.type,
        body
      })
      .then(results => {
        if (!results.hits.hits.length) {
          return results.hits.hits;
        }

        const points = results.hits.hits.map(doc =>
          turf.point(doc._source.coordinates)
        );

        if (lat && lng && !bounds) {
          points.push(turf.point([lng, lat]));
        }

        // create a bounding box for the results
        const envelope = turf.bbox(
          turf.buffer(turf.envelope(turf.featureCollection(points)), 0.5, {
            units: "miles"
          })
        );

        bounds = {
          southwest: {
            lat: envelope[1],
            lng: envelope[0]
          },
          northeast: {
            lat: envelope[3],
            lng: envelope[2]
          }
        };

        return results.hits.hits.map(doc => {
          // doc._source.photos = _(doc._source.photos)
          //   .shuffle()
          //   .value();

          const hit = _.cloneDeep(doc);

          hit._source.groupedHours = groupHours(hit._source, currentTime);

          return hit;
        });
      });

    if (!data.length) {
      res.send({
        empty: true,
        city
      });
      return;
    }

    const calendar = makeEvents(currentTime, data);

    let markerData = [{ title: "Up Next", data }, ...calendar];

    const markers = makeMarkers(currentTime, markerData);

    const { events: listData, tags: occurringTags } = makeListData(
      calendar,
      currentTime
    );

    const list = [
      {
        title: "Up Next",
        data: listData
      }
    ];

    const newest = [
      {
        title: "Newest",
        data: data.sort((a, b) => {
          return b._source.updatedAt - a._source.updatedAt;
        })
      }
    ];

    let closest;

    if (lat && lng) {
      closest = [
        {
          title: "Closest",
          data: _(data)
            .uniqBy("_source.placeid")
            .filter(doc => doc.sort[0] <= 45)
            .sort((a, b) => {
              return a.sort[0] - b.sort[0];
            })
            .value()
        }
      ];
    }

    const places = _(data)
      .groupBy(hit => hit._source.placeid)
      .mapValues(group => group.map(doc => doc._id))
      .value();

    const keyedData = _(data)
      .keyBy("_id")
      .value();

    const response = {
      calendar,
      markers,
      data: keyedData,
      list,
      places,
      newest,
      occurringTags,
      tags: []
    };

    if (bounds) {
      response.bounds = bounds;
      response.tags = await popularTags(bounds);
    }

    if (city) {
      response.city = city;
    }

    if (closest && closest[0].data.length) {
      response.closest = closest;
    }

    res.send(response);
  } catch (error) {
    res.send({
      error: error.message,
      city
    });
  }
};

async function getCity(lat, lng) {
  const results = await new Promise((resolve, reject) => {
    servicesApi.reverseGeocode(
      {
        latlng: [lat, lng]
      },
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response.json.results);
      }
    );
  });

  const city = {
    text: undefined,
    bounds: undefined
  };

  let geocode = results.find(location => {
    return location.types.indexOf("locality") > -1;
  });

  if (!geocode) {
    geocode = results.find(location => {
      return location.types.indexOf("neighborhood") > -1;
    });
  } else {
    city.text = geocode.formatted_address;
    city.bounds = geocode.geometry.bounds;
  }

  if (!geocode) {
    geocode = results.find(location => {
      return location.types.indexOf("street_address") > -1;
    });
  }

  if (geocode && !city.text) {
    const locality = geocode.address_components.find(
      component => component.types.indexOf("locality") > -1
    );

    let state = geocode.address_components.find(
      component => component.types.indexOf("administrative_area_level_1") > -1
    );

    if (!state) {
      state = geocode.address_components.find(
        component => component.types.indexOf("country") > -1
      );
    }

    city.text = `${locality.long_name}, ${state.long_name}`;
  }

  return city;
}
