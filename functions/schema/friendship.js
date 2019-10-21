module.exports = {
  index: "friendships",
  body: {
    uid: { type: "keyword" },
    fid: { type: "keyword" },
    createdAt: {
      type: "date",
      format: "epoch_millis"
    }
  }
};
