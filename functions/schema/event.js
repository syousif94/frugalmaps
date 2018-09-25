const event = {
  index: "events",
  type: "event",
  body: {
    properties: {
      title: { type: "text" },
      description: { type: "text" },
      location: { type: "text" },
      coordinates: { type: "geo_point" },
      photos: { enabled: false },
      phone: { enabled: false },
      days: { enabled: false },
      start: { enabled: false },
      end: { enabled: false },
      street: { type: "text" },
      neighborhood: { type: "keyword" },
      city: { type: "keyword" }
    }
  }
};

module.exports = event;
