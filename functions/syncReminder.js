const elastic = require("./elastic");
const event = require("./schema/event");
const reminder = require("./schema/reminder");
const { db } = require("./firebase.js");

module.exports = async function syncReminder(req, res) {
  const { id, token, state } = req.body;

  const response = await elastic.mget({
    body: {
      docs: [
        { _index: event.index, _type: event.type, _id: id },
        { _index: reminder.index, _type: reminder.type, _id: `${id}${token}` }
      ]
    }
  });

  const reminderRef = db.collection("reminders").doc(id);

  await db.runTransaction(async tx => {
    const doc = await tx.get(reminderRef);

    if (!doc.exists && state) {
      await tx.set(reminderRef, 2);
      return 2;
    }
  });

  console.log(response);

  res.send({});
};
