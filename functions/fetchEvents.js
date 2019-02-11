const elastic = require("./elastic");
const Event = require("./schema/event");

module.exports = async function fetchEvents(req, res) {
  const { ids } = req.body;

  try {
    const events = await elastic
      .mget({
        index: Event.index,
        type: Event.type,
        body: {
          ids
        }
      })
      .then(res => res.docs);

    res.send({
      events
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
