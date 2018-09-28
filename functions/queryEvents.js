const elastic = require("./elastic");
const event = require("./schema/event");

function queryEvents(req, res) {
  const { bounds } = req.body;

  let query = elastic.search({
    index: event.index,
    type: event.type,
    body: {
      query: {
        match_all: {}
      }
    }
  });

  query
    .then(res => {
      const hits = res.hits.hits;

      res.send({
        hits
      });

      return;
    })
    .catch(error => {
      res.send({
        error: error.message
      });
    });
}

module.exports = queryEvents;
