const AWS = require("./aws");
const s3 = new AWS.S3();

module.exports = async function backup(key, body) {
  const params = {
    Bucket: "buncha",
    Key: `backup/${key}.json`,
    Body: JSON.stringify(body),
    ContentType: "application/json"
  };
  try {
    await new Promise((resolve, reject) => {
      s3.putObject(params, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    console.log("backup failed", error.message, key, body);
  }
};
