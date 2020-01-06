const userSchema = require("../schema/user");
const elastic = require("../elastic");

async function updateAccount(req, res) {
  try {
    const {
      name = undefined,
      pushtoken = undefined,
      coordinates = undefined
    } = req.body;

    const { id } = req.user;

    const doc = {};

    if (name) {
      doc.name = name;
    }
    if (pushtoken) {
      doc.pushtoken = pushtoken;
    }
    if (coordinates) {
      doc.coordinates = coordinates;
    }

    await elastic.update({
      index: userSchema.index,
      id,
      body: {
        doc,
        doc_as_upsert: true
      }
    });
    res.send({});
  } catch (error) {
    console.log(error.stack);
    res.send({
      error: error.message
    });
  }
}

module.exports = updateAccount;
