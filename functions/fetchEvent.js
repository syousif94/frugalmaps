const elastic = require("./elastic");
const Event = require("./schema/event");

module.exports = async function fetchEvent(req, res) {
  const { id } = req.body;

  try {
    const event = await elastic.get({
      index: Event.index,
      type: "_doc",
      id
    });

    const body = {
      query: {
        term: { placeid: event._source.placeid }
      },
      size: 20
    };

    const events = await elastic
      .search({
        index: Event.index,
        type: "_doc",
        body
      })
      .then(res => res.hits.hits.filter(hit => hit._id !== id));

    res.send({
      events: [event, ...events]
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
