const elastic = require("./elastic");
const event = require("./schema/event");
const remove = require("./removeFromS3");

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
      res.send({});
      return;
    })
    .catch(error => {
      res.send({
        error: error.message
      });
    });

  remove(`event/${id}`);
}

module.exports = deleteEvent;
