const location = {
  index: "users",
  type: "user",
  body: {
    properties: {
      pushtoken: { type: "keyword" },
      coordinates: { type: "geo_point" }
    }
  }
};

module.exports = location;
