require("dotenv").config();
const elastic = require("../elastic");
const schema = require("../schema/elastic");
const _ = require("lodash");

const indexes = {
  events: [
    require("./el-alma-happy-hour.json"),
    require("./uchiko-sake-social-hour.json")
  ],
  locations: [require("./austin-texas.json")].map(doc => ({
    ...doc,
    _id: _.kebabCase(doc.name)
  }))
};

async function setup() {
  const promises = Object.keys(indexes).map(bulkInsert);
  await Promise.all(promises);
}

async function destroy() {
  const promises = Object.keys(indexes).map(index => schema[index].delete());
  await Promise.all(promises);
}

module.exports = {
  setup,
  destroy
};

async function bulkInsert(index) {
  const body = indexes[index].flatMap(doc => {
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

  await elastic.bulk({
    body
  });
}
