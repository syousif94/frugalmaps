const location = {
  index: "locations",
  body: {
    properties: {
      name: { type: "text" },
      type: { type: "keyword" },
      coordinates: { type: "geo_point" },
      placeid: { enabled: false },
      bounds: { enabled: false }
    }
  }
};

module.exports = location;
