require("dotenv").config();
require("isomorphic-fetch");

const client = require("../elastic");
const event = require("./event");
const location = require("./location");

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
        console.log("index exists");
        return;
      }

      return createIndex(mapping.index);
    })
    .then(() => {
      return putMapping(mapping);
    })
    .then(() => {
      console.log(`created ${mapping.index}`);
      return;
    })
    .catch(error => {
      console.log(error);
    });
}

function deleteIndex(indexName) {
  return client.indices
    .delete({
      index: indexName
    })
    .then(() => console.log(`deleted ${indexName}`))
    .catch(error => console.log(error));
}

function mapEvents() {
  return initializeIndex(event);
}

function deleteEvents() {
  return deleteIndex(event.index);
}

function mapLocations() {
  return initializeIndex(location);
}

function deleteLocations() {
  return deleteIndex(location.index);
}

module.exports = {
  events: {
    map: mapEvents,
    delete: deleteEvents
  },
  locations: {
    map: mapLocations,
    delete: deleteLocations
  }
};
