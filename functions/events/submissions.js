const { db } = require("../firebase.js");

async function submissions(req, res) {
  const submissions = await db
    .collection("submissions")
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()))
    );

  res.send({
    submissions
  });
}

module.exports = submissions;
