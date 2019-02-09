const servicesApi = require("../google");
const elastic = require("../elastic");
const event = require("../schema/event");
const querystring = require("querystring");
const Fuse = require("fuse.js");

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
                  fuzziness: 3
                }
              }
            },
            {
              match: {
                location: {
                  query: input,
                  fuzziness: 3
                }
              }
            },
            {
              match: {
                description: {
                  query: input,
                  fuzziness: 3
                }
              }
            },
            {
              match_phrase_prefix: {
                title: {
                  query: input,
                  max_expansions: 30
                }
              }
            },
            {
              match_phrase_prefix: {
                location: {
                  query: input,
                  max_expansions: 30
                }
              }
            },
            {
              match_phrase_prefix: {
                description: {
                  query: input,
                  max_expansions: 30
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

    const cities = values
      .filter(val => val.name)
      .map((val, index) => {
        return { id: index, name: val.name };
      });

    const eventList = events.map((val, index) => {
      return {
        id: index + cities.length,
        name: val._source.title,
        description: val._source.description,
        location: val._source.location
      };
    });

    const fuse = new Fuse([...cities, ...eventList], {
      keys: ["name", "description", "location"],
      id: "id",
      shouldSort: true,
      findAllMatches: true,
      tokenize: true,
      matchAllTokens: true,
      distance: 100,
      threshold: 0.6
    });

    const sortedResults = fuse.search(input.split(",")[0]);

    const sorted = sortedResults.map(id => {
      if (id >= cities.length) {
        return events[id - cities.length];
      }
      return values[id];
    });

    res.send({
      values,
      events: sorted
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
