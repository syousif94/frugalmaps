const reminder = {
  index: "reminders",
  body: {
    properties: {
      pushtoken: { type: "keyword" },
      event: { type: "keyword" }
    }
  }
};

module.exports = reminder;
