module.exports = {
  index: "friends",
  body: {
    properties: {
      uid: { type: "keyword" },
      fid: { type: "keyword" },
      muted: { type: "boolean" },
      mutual: { type: "boolean" },
      createdAt: {
        type: "date",
        format: "epoch_millis"
      }
    }
  }
};
