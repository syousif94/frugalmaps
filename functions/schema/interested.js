module.exports = {
  index: "interesteds",
  body: {
    event: { type: "keyword" },
    date: {
      type: "date",
      format: "epoch_millis"
    },
    always: { type: "boolean" },
    day: { type: "integer" },
    time: { enabled: false },
    uid: { type: "keyword" },
    createdAt: {
      type: "date",
      format: "epoch_millis"
    }
  }
};
