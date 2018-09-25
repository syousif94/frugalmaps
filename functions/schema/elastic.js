require("dotenv").config();
require("isomorphic-fetch");

const client = require("../elastic");

function indexExists(indexName) {
  return client.indices.exists({
    index: indexName
  });
}

function createIndex(indexName) {
  return client.indices.create({
    index: indexName,
    body: {
      settings: {
        "index.mapper.dynamic": false
      }
    }
  });
}

function putMapping(mapping) {
  return client.indices.putMapping(mapping);
}

function initializeIndex(mapping) {
  return indexExists(mapping.index)
    .then(exists => {
      if (exists) {
        throw new Error("Index exists");
      }

      return createIndex(mapping.index);
    })
    .then(() => {
      return putMapping(mapping);
    })
    .catch(error => {
      console.log(error);
    });
}

function deleteIndex(indexName) {
  return client.indices.delete({
    index: indexName
  });
}

module.exports = {
  indexExists,
  createIndex,
  putMapping,
  deleteIndex,
  initializeIndex
};
