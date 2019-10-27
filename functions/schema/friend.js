module.exports = {
  index: "friends",
  body: {
    uid: { type: "keyword" },
    fid: { type: "keyword" },
    muted: { type: "boolean" },
    createdAt: {
      type: "date",
      format: "epoch_millis"
    }
  }
};
