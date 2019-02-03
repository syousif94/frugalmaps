const AWS = require("./aws");
const s3 = new AWS.S3();

module.exports = async function remove(key) {
  const copyParams = {
    Bucket: "buncha",
    CopySource: `backup/${key}.json`,
    Key: `deleted/${key}.json`
  };
  const deleteParams = {
    Bucket: "buncha",
    Key: `backup/${key}.json`
  };
  try {
    await new Promise((resolve, reject) => {
      s3.copyObject(copyParams, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      s3.deleteObject(deleteParams, err => {
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
