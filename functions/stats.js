const elastic = require("./elastic");

module.exports = async function stats(req, res) {
  const indices = await elastic.cat.indices({
    format: "json"
  });
  res.send(indices);
};
