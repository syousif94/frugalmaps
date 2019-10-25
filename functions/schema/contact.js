const user = {
  index: "contacts",
  body: {
    properties: {
      uid: { type: "keyword" },
      cid: { type: "keyword" },
      blocked: { type: "boolean" },
      createdAt: {
        type: "date",
        format: "epoch_millis"
      }
    }
  }
};

module.exports = user;
