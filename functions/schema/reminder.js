const reminder = {
  index: "reminders",
  type: "reminder",
  body: {
    properties: {
      pushtoken: { type: "keyword" },
      event: { type: "keyword" }
    }
  }
};

module.exports = reminder;
