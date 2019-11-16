const user = {
  index: "contacts",
  body: {
    properties: {
      uid: { type: "keyword" },
      cid: { type: "keyword" },
      name: { type: "text" },
      number: { enabled: false },
      createdAt: {
        type: "date",
        format: "epoch_millis"
      }
    }
  }
};

module.exports = user;
