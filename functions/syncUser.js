const elastic = require("./elastic");
const user = require("./schema/user");

module.exports = async function syncUser(req, res) {
  try {
    const { token, location } = req.body;

    const body = {
      token,
      location
    };

    await elastic.index({
      index: user.index,
      type: user.type,
      id: token,
      body
    });

    res.send({});
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
