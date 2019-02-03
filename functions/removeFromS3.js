const AWS = require("./aws");
const s3 = new AWS.S3();

module.exports = async function remove(key) {
  const params = {
    Bucket: "buncha",
    Key: `deleted/${key}.txt`,
    Body: ""
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
    console.log("deleting failed", error.message, key);
  }
};
