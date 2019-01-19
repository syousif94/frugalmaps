const user = {
  index: "users",
  type: "user",
  body: {
    properties: {
      pushtoken: { type: "keyword" },
      coordinates: { type: "geo_point" }
    }
  }
};

module.exports = user;
