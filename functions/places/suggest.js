const servicesApi = require("../google");
const elastic = require("../elastic");
const event = require("../schema/event");
const querystring = require("querystring");
const Fuse = require("fuse.js");
const turf = require("@turf/turf");

const base = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${
  process.env.GOOGLE
}`;

module.exports = async function suggestPlaces(req, res) {
  const query = req.body.query;

  const url = `${base}&${query}`;

  try {
    const valuesQuery = fetch(url)
      .then(res => res.json())
      .then(json => {
        const detailPromises = json.predictions.map(prediction => {
          return new Promise((resolve, reject) => {
            const query = {
              placeid: prediction.place_id
            };
            servicesApi.place(query, (err, response) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(response.json.result);
            });
          });
        });

        return Promise.all(detailPromises);
      });

    const parsedQuery = querystring.parse(query);

    const input = parsedQuery.input;
    let lat;
    let lng;
    if (parsedQuery.location) {
      [lat, lng] = parsedQuery.location
        .split(",")
        .map(deg => parseFloat(deg, 10));
    }

    const body = {
      query: {
        bool: {
          should: [
            {
              match: {
                title: {
                  query: input,
                  fuzziness: 4
                }
              }
            },
            {
              match: {
                location: {
                  query: input,
                  fuzziness: 4
                }
              }
            },
            {
              match: {
                description: {
                  query: input,
                  fuzziness: 4
                }
              }
            },
            {
              match_phrase_prefix: {
                title: {
                  query: input,
                  max_expansions: 50
                }
              }
            },
            {
              match_phrase_prefix: {
                location: {
                  query: input,
                  max_expansions: 50
                }
              }
            },
            {
              match_phrase_prefix: {
                description: {
                  query: input,
                  max_expansions: 50
                }
              }
            }
          ]
        }
      },
      size: 10
    };

    if (lat && lng) {
      body.sort = [
        {
          _geo_distance: {
            coordinates: [lng, lat],
            order: "asc",
            unit: "mi",
            distance_type: "plane"
          }
        }
      ];
    }

    const eventsQuery = elastic
      .search({
        type: event.type,
        index: event.index,
        body
      })
      .then(res => res.hits.hits);

    const [values, events] = await Promise.all([valuesQuery, eventsQuery]);

    const cities = values.filter(val => val.name);

    let sorted;

    if (lat && lng) {
      const currentLocation = turf.point([lng, lat]);

      const distanceOpts = { units: "miles" };

      const [closeCities, remainingCities] = cities.reduce(
        (acc, cur, index) => {
          const to = turf.point([
            cur.geometry.location.lng,
            cur.geometry.location.lat
          ]);
          const distance = turf.distance(currentLocation, to, { distanceOpts });

          if (distance > 2000) {
            acc[1].push(cur);
          } else {
            acc[0].push({ id: index, city: cur.name });
          }

          return acc;
        },
        [[], []]
      );

      const [closeEvents, remainingEvents] = events.reduce(
        (acc, cur, index) => {
          if (cur.sort[0] > 45) {
            acc[1].push(cur);
          } else {
            acc[0].push({
              id: index + cities.length,
              name: cur._source.title,
              description: cur._source.description,
              location: cur._source.location
            });
          }

          return acc;
        },
        [[], []]
      );

      const fuseOpts = {
        keys: [
          { name: "name", weight: "0.8" },
          { name: "description", weight: "0.5" },
          { name: "location", weight: "0.6" },
          { name: "city", weight: "0.6" }
        ],
        id: "id",
        shouldSort: true,
        findAllMatches: true,
        tokenize: true,
        matchAllTokens: true,
        distance: 100,
        threshold: 0.6
      };

      const nearbyFuse = new Fuse([...closeCities, ...closeEvents], fuseOpts);

      const getData = id => {
        if (id < cities.length) {
          return cities[id];
        } else {
          return events[id - cities.length];
        }
      };

      const searchText = input.split(",")[0];

      const sortedNeary = nearbyFuse.search(searchText).map(getData);

      sorted = [...sortedNeary, ...remainingEvents, ...remainingCities];
    } else {
      sorted = interleave(cities, events);
    }

    res.send({
      values: cities,
      events: sorted
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};

function interleave() {
  const arrs = [].slice.call(arguments);
  const maxLength = Math.max.apply(
    Math,
    arrs.map(function(arr) {
      return arr.length;
    })
  );

  const result = [];

  for (let i = 0; i < maxLength; ++i) {
    arrs.forEach(function(arr) {
      if (arr.length > i) {
        result.push(arr[i]);
      }
    });
  }

  return result;
}
