const elastic = require("./elastic");
const user = require("./schema/user");
const { backup } = require("./backupToS3");

module.exports = async function syncUser(req, res) {
  try {
    const { token, location, postCode } = req.body;

    if (postCode === process.env.POSTCODE) {
      const users = await elastic
        .search({
          index: user.index,
          type: user.type,
          body: {
            query: { match_all: {} },
            size: 100
          }
        })
        .then(res => res.hits.hits);
      res.send({ users });
      return;
    }

    if (!token || !location) {
      throw new Error("Invalid request");
    }

    const body = {
      pushtoken: token,
      coordinates: location
    };

    await elastic.index({
      index: user.index,
      type: user.type,
      id: token,
      body
    });

    res.send({});

    backup(`user/${token}`, body);
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
