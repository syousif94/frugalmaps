const userSchema = require("../schema/user");
const contactSchema = require("../schema/contact");
const elastic = require("../elastic");
const sh = require("shorthash");

async function contacts(req, res) {
  try {
    const userToken = req.user;

    const { contacts = [], after = null } = req.body;

    const user = await elastic
      .get({
        index: userSchema.index,
        id: userToken.id
      })
      .catch(error => {});

    if (!user) {
      throw new Error("Cannot find user..");
    }

    if (!contacts.length) {
      res.send({
        contacts: await getContacts(userToken.id, after)
      });
      return;
    }

    await saveContacts(userToken.id, contacts);

    await res.send({});
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

async function contact(req, res) {
  try {
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

async function getContacts(uid, after) {
  const contacts = await elastic
    .search({
      index: contactSchema.index,
      body: {
        query: {
          term: { uid }
        }
      }
    })
    .then(res => res.hits.hits);

  return contacts;
}

async function saveContacts(uid, contacts) {
  const now = Date.now();
  const body = contacts.flatMap(contact => [
    { index: { _index: contactSchema.index } },
    {
      name: contact.name,
      cid: sh.unique(contact.number),
      uid,
      createdAt: now
    }
  ]);

  const { body: bulkResponse } = await elastic.bulk({
    body
  });

  if (bulkResponse) {
    throw new Error("Failed to insert contacts..");
  }
}

module.exports = {
  contacts,
  contact
};
