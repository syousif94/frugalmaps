module.exports = {
  index: "plans",
  body: {
    event: { type: "keyword" },
    date: {
      type: "date",
      format: "epoch_millis"
    },
    always: { type: "boolean" },
    days: { type: "integer" },
    uid: { type: "keyword" },
    attending: { type: "keyword" },
    maybe: { type: "keyword" },
    createdAt: {
      type: "date",
      format: "epoch_millis"
    }
  }
};
