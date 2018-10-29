const elastic = require("../elastic");
const event = require("../schema/event");

async function published(req, res) {
  const {
    text = ""
    // lat,
    // lng
  } = req.body;

  try {
    const body = {
      query: {
        bool: {
          must: [{ match_all: {} }]
        }
      },
      sort: [{ updatedAt: "desc" }],
      size: 100
    };

    if (text && text.length) {
      delete body.query.bool.must;
      body.query.bool.should = [
        {
          match: {
            location: text
          }
        },
        {
          match: {
            title: text
          }
        }
      ];
      body.sort = ["_score"];
    }

    const published = await elastic
      .search({
        index: event.index,
        type: event.type,
        body
      })
      .then(res => res.hits.hits);

    res.send({
      published
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

module.exports = published;
