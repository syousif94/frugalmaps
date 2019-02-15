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
              multi_match: {
                query: input,
                type: "phrase_prefix",
                fields: ["title", "description", "location"]
              }
            },
            {
              multi_match: {
                query: input,
                type: "best_fields",
                fields: ["title", "description", "location"],
                operator: "and",
                fuzziness: 3,
                tie_breaker: 0.3
              }
            },
            {
              multi_match: {
                query: input,
                type: "phrase",
                fields: ["title", "description", "location"]
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
