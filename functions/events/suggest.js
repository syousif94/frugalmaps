const elastic = require("../elastic");
const event = require("../schema/event");

module.exports = async function suggestEvents(req, res) {
  const { input, lat, lng } = req.body;

  try {
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

    const events = await elastic
      .search({
        type: event.type,
        index: event.index,
        body
      })
      .then(res => res.hits.hits);

    res.send({
      events
    });
  } catch (error) {
    console.log(error);
    res.send({
      error: error.message
    });
  }
};
