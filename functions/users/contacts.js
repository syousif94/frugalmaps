async function contacts(req, res) {
  try {
    const user = req.user;

    const { contacts = [] } = req.body;

    console.log(user, contacts);

    if (!contacts.length) {
      res.send({
        contacts: []
      });
      return;
    }

    res.send({});
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

async function getContacts() {}

async function saveContacts() {}

module.exports = {
  contacts,
  contact
};
