const client = require("@google/maps").createClient({
  key: process.env.GOOGLE
});

module.exports = client;
