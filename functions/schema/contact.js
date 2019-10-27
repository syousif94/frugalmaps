const user = {
  index: "contacts",
  body: {
    properties: {
      uid: { type: "keyword" },
      cid: { type: "keyword" },
      name: { type: "text" },
      createdAt: {
        type: "date",
        format: "epoch_millis"
      }
    }
  }
};

module.exports = user;
