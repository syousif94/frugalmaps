const user = {
  index: "users",
  body: {
    properties: {
      pushtoken: { type: "keyword" },
      coordinates: { type: "geo_point" }
    }
  }
};

module.exports = user;
