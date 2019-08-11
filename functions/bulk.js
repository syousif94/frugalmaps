const elastic = require("./elastic");

module.exports = async function bulk(req, res) {
  const { index, docs, postCode } = req.body;

  if (postCode !== process.env.POSTCODE) {
    res.send("Invalid Code");
    return;
  }

  res.send(200);

  const body = docs.flatMap(doc => [{ index: { _index: index } }, doc]);

  const { body: bulkResponse } = await elastic.bulk({
    body
  });

  // if (bulkResponse.errors) {
  //   const erroredDocuments = [];
  //   // The items array has the same order of the dataset we just indexed.
  //   // The presence of the `error` key indicates that the operation
  //   // that we did for the document has failed.
  //   bulkResponse.items.forEach((action, i) => {
  //     const operation = Object.keys(action)[0];
  //     if (action[operation].error) {
  //       erroredDocuments.push({
  //         // If the status is 429 it means that you can retry the document,
  //         // otherwise it's very likely a mapping error, and you should
  //         // fix the document before to try it again.
  //         status: action[operation].status,
  //         error: action[operation].error,
  //         operation: body[i * 2],
  //         document: body[i * 2 + 1]
  //       });
  //     }
  //   });

  //   console.log(bulkResponse.errors);
  // }

  const { body: count } = await elastic.count({ index });
  console.log(count);
};
