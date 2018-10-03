const elastic = require("./elastic");
const event = require("./schema/event");

function deleteEvent(req, res) {
  const { id, postCode } = req.body;

  if (postCode !== process.env.POSTCODE) {
    res.send({
      error: "Invalid Post Code"
    });
    return;
  }

  elastic
    .delete({
      type: event.type,
      index: event.index,
      id
    })
    .then(() => {
      res.send(200);
      return;
    })
    .catch(error => {
      res.send({
        error: error.message
      });
    });
}

module.exports = deleteEvent;
