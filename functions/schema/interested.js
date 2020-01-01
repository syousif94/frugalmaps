module.exports = {
  index: "interesteds",
  body: {
    properties: {
      eid: { type: "keyword" },
      dates: {
        type: "date",
        format: "epoch_millis"
      },
      always: { type: "boolean" },
      days: { type: "integer" },
      time: { enabled: false },
      uid: { type: "keyword" },
      createdAt: {
        type: "date",
        format: "epoch_millis"
      }
    }
  }
};
