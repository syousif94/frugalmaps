const elastic = require("./elastic");
const event = require("./schema/event");

function createEvent(req, res) {
  const {
    id,
    postCode,
    title,
    description,
    place,
    startTime,
    endTime
  } = req.body;

  if (!postCode) {
    res.send({
      error: "Invalid Code"
    });
  }

  res.send(200);
}

module.exports = createEvent;
