const event = {
  index: "events",
  body: {
    properties: {
      updatedAt: {
        type: "date",
        format: "epoch_millis"
      },
      title: { type: "text" },
      description: { type: "text" },
      location: { type: "text" },
      coordinates: { type: "geo_point" },
      tags: { type: "keyword" },
      placeid: { type: "keyword" },
      priceLevel: { type: "integer" },
      viewport: { enabled: false },
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
