const event = {
  index: "events",
  type: "event",
  body: {
    properties: {
      title: { type: "text" },
      description: { type: "text" },
      location: { type: "text" },
      coordinates: { type: "geo_point" },
      type: { type: "keyword" },
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
      city: { type: "keyword" },
      state: { type: "keyword" },
      shortState: { enabled: false }
    }
  }
};

module.exports = event;
