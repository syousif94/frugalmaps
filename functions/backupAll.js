const backup = require("./backupToS3");
const elastic = require("./elastic");
const event = require("./schema/event");
const location = require("./schema/location");
const user = require("./schema/user");
const reminder = require("./schema/reminder");

module.exports = async function backupAll(req, res) {
  try {
    const { postCode } = req.body;

    if (postCode !== process.env.POSTCODE) {
      res.send("Invalid Code");
      return;
    }

    const indexes = [event, location];

    const promises = indexes.map(async index => {
      const docs = await elastic
        .search({
          index: index.index,
          type: index.type,
          body: {
            query: { match_all: {} },
            size: 1000
          }
        })
        .then(res => res.hits.hits);

      await Promise.all(
        docs.map(async doc => {
          return backup(`${index.index}/${doc._id}`, doc._source);
        })
      );
    });

    await Promise.all(promises);
    res.send(200);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
