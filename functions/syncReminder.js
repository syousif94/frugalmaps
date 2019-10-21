const elastic = require("./elastic");
const Event = require("./schema/event");
const Reminder = require("./schema/reminder");
const { db } = require("./firebase.js");
const { backup } = require("./backupToS3");

module.exports = async function syncReminder(req, res) {
  try {
    const { id, token, state, postCode } = req.body;

    if (postCode === process.env.POSTCODE) {
      const reminders = await elastic
        .search({
          index: Reminder.index,
          type: Reminder.type,
          body: {
            query: { match_all: {} },
            size: 100
          }
        })
        .then(res => res.hits.hits);
      res.send({ reminders });
      return;
    }

    if (!id || !token || state === undefined) {
      throw new Error("Invalid request");
    }

    const reminderId = `${id}${token}`;

    const {
      docs: [event, reminder]
    } = await elastic.mget({
      body: {
        docs: [
          { _index: Event.index, _type: Event.type, _id: id },
          { _index: Reminder.index, _type: Reminder.type, _id: reminderId }
        ]
      }
    });

    if (!event.found) {
      throw new Error("Invalid event");
    }

    if (reminder.found && !state) {
      await elastic.delete({
        index: Reminder.index,
        type: Reminder.type,
        id: reminderId
      });
    } else if (state && !reminder.found) {
      const body = {
        pushtoken: token,
        event: id
      };
      await elastic.index({
        index: Reminder.index,
        type: Reminder.type,
        id: reminderId,
        body
      });

      backup(`reminder/${reminderId}`, body);
    }

    const reminderRef = db.collection("reminders").doc(id);

    const count = await db.runTransaction(async tx => {
      const doc = await tx.get(reminderRef);

      if (!doc.exists && state) {
        await tx.set(reminderRef, { count: 2 });
        return 2;
      }

      const alreadyExists = state && reminder.found;
      const notNeeded = !state && !reminder.found;

      if (alreadyExists) {
        return doc.data().count;
      } else if (notNeeded) {
        return doc.exists ? doc.data().count : 1;
      }

      const incrementBy = state ? 1 : -1;

      const count = doc.data().count + incrementBy;

      if (count < 1) {
        return 1;
      }

      await tx.update(reminderRef, {
        count
      });

      return count;
    });

    res.send({ count });
  } catch (error) {
    res.send({ error: error.message });
  }
};
