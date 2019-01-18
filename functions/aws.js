const AWS = require("aws-sdk");

AWS.config.loadFromPath("./aws.json");

module.exports = AWS;
