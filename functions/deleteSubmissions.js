const { db } = require("./firebase.js");

async function deleteSubmissions(req, res) {
  const { fids, postCode } = req.body;

  if (postCode !== process.env.POSTCODE) {
    res.send({
      error: "Invalid Code"
    });
    return;
  }

  if (!fids || !fids.length) {
    res.send({
      error: "Invalid FID"
    });
    return;
  }

  try {
    const deletions = fids.map(fid =>
      db
        .collection("submissions")
        .doc(fid)
        .delete()
    );
    await Promise.all(deletions);

    res.send({});
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

module.exports = deleteSubmissions;
