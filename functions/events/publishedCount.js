const elastic = require("../elastic");
const event = require("../schema/event");

async function count(req, res) {
  try {
    const { count } = await elastic.count({
      index: event.index
    });

    res.send({
      count
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

module.exports = count;
