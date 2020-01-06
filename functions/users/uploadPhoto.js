const aws = require("../aws.json");
const S3Policy = require("../lib/s3policy");
const shortid = require("shortid");
const userSchema = require("../schema/user");
const elastic = require("../elastic");

function getPolicy(req, res) {
  const { id: uid } = req.user;

  const key = `${uid}${shortid.generate()}`;
  const expiration = Date.now() + 300000;
  const { policy, signature } = S3Policy({
    secret: aws.secretAccessKey,
    length: 10000000,
    bucket: "buncha",
    key: `profile/${key}.jpg`,
    type: "image/jpeg",
    expires: new Date(expiration),
    acl: "private"
  });

  res.send({
    policy,
    signature,
    key
  });
}

async function updatePhoto(req, res) {
  const { key } = req.body;
  const { id } = req.user;

  try {
    await elastic.update({
      index: userSchema.index,
      id,
      body: {
        doc: {
          photo: key
        },
        doc_as_upsert: true
      }
    });

    res.send({});
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

module.exports = {
  getPolicy,
  updatePhoto
};
