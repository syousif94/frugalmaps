require("dotenv").config();
require("isomorphic-fetch");

const client = require("../elastic");
const event = require("./event");
const location = require("./location");
const user = require("./user");
const reminder = require("./reminder");

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

function mapUsers() {
  return initializeIndex(user);
}

function deleteUsers() {
  return deleteIndex(user.index);
}

function mapReminders() {
  return initializeIndex(reminder);
}

function deleteReminders() {
  return deleteIndex(reminder.index);
}

module.exports = {
  events: {
    map: mapEvents,
    delete: deleteEvents
  },
  locations: {
    map: mapLocations,
    delete: deleteLocations
  },
  users: {
    map: mapUsers,
    delete: deleteUsers
  },
  reminders: {
    map: mapReminders,
    delete: deleteReminders
  }
};
