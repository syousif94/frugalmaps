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
      placeid: { type: "keyword" },
      priceLevel: { enabled: false },
      rating: { enabled: false },
      website: { enabled: false },
      photos: { enabled: false },
      phone: { enabled: false },
      days: { enabled: false },
      start: { enabled: false },
      end: { enabled: false },
      periods: { enabled: false },
      hours: { enabled: false },
      address: { enabled: false },
      neighborhood: { type: "keyword" },
      city: { type: "keyword" },
      state: { type: "keyword" },
      shortState: { enabled: false },
      url: { enabled: false }
    }
  }
};

module.exports = event;
