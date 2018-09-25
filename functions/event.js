const elastic = require("./elastic");
const google = require("./google");
const event = require("./schema/event");

function createEvent(req, res) {
  const { id, title, description, place, startTime, endTime, days } = req.body;

  const post = {
    title,
    description,
    place,
    days,
    start: startTime,
    end: endTime
  };

  res.send(200);
}

module.exports = createEvent;
