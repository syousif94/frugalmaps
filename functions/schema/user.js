const user = {
  index: "users",
  body: {
    properties: {
      pushtoken: { type: "keyword" },
      coordinates: { type: "geo_point" },
      name: { type: "text" },
      number: { type: "keyword" },
      lastSeen: {
        type: "date",
        format: "epoch_millis"
      },
      photo: { enabled: false }
    }
  }
};

module.exports = user;
