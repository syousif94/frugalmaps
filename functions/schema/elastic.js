require("dotenv").config();
require("isomorphic-fetch");

const client = require("../elastic");
const event = require("./event");
const location = require("./location");
const user = require("./user");
const contact = require("./contact");
const friend = require("./friend");
const interested = require("./interested");

function indexExists(indexName) {
  return client.indices.exists({
    index: indexName
  });
}

function createIndex(indexName) {
  return client.indices.create({
    index: indexName
  });
}

function putMapping(mapping) {
  return client.indices.putMapping(mapping);
}

function initializeIndex(mapping) {
  return indexExists(mapping.index)
    .then(exists => {
      if (exists) {
        console.log(`${mapping.index} index exists`);
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

function index(event) {
  return {
    map: () => initializeIndex(event),
    delete: () => deleteIndex(event.index)
  };
}

module.exports = {
  events: index(event),
  locations: index(location),
  users: index(user),
  friends: index(friend),
  contacts: index(contact),
  interesteds: index(interested),
  init: async function() {
    await this.events.map();
    await this.locations.map();
  }
};
