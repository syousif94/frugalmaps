const event = {
  index: "events",
  type: "event",
  body: {
    properties: {
      title: { type: "text" },
      description: { type: "text" },
      location: { type: "text" },
      coordinates: { type: "geo_point" },
      placeid: { enabled: false },
      photos: { enabled: false },
      phone: { enabled: false },
      days: { enabled: false },
      start: { enabled: false },
      end: { enabled: false },
      hours: { enabled: false },
      address: { enabled: false },
      street: { type: "text" },
      neighborhood: { type: "keyword" },
      city: { type: "keyword" }
    }
  }
};

module.exports = event;
