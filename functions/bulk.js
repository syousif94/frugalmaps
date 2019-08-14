const elastic = require("./elastic");
const schema = require("./schema/elastic");

module.exports = async function bulk(req, res) {
  const { index, docs, postCode } = req.body;

  if (postCode !== process.env.POSTCODE) {
    res.send("Invalid Code");
    return;
  }

  res.send(200);

  const body = docs.flatMap(doc => {
    if (!doc._id) {
      return [{ index: { _index: index } }, doc];
    }

    const _id = doc._id;

    let source = { ...doc };

    delete source._id;

    return [{ index: { _index: index, _id } }, source];
  });

  await schema[index].delete();

  await schema[index].map();

  const { body: bulkResponse } = await elastic.bulk({
    body
  });
};
