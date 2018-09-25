const event = {
  index: "events",
  type: "event",
  body: {
    properties: {
      title: { type: "text" },
      description: { type: "text" },
      location: { type: "text" },
      coordinates: { type: "geo_point" },
      start: { enabled: false },
      end: { enabled: false },
      street: { type: "text" },
      neighborhood: { type: "text" },
      city: { type: "text" }
    }
  }
};

module.exports = event;
