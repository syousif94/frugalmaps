const AWS = require("./aws");
const rp = require("request-promise-native");
const sharp = require("sharp");
const elastic = require("./elastic");
const event = require("./schema/event");

const s3 = new AWS.S3();

const photoBase = `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.GOOGLE}&maxheight=800&photoreference=`;

function transformRes(buffer, res) {
  return {
    url: res.request.uri.href,
    buffer
  };
}

function getImage(url) {
  return rp({
    url,
    followAllRedirects: true,
    encoding: null,
    transform: transformRes
  });
}

async function existsInS3(placeid) {
  try {
    const data = await new Promise((resolve, reject) => {
      const params = {
        Bucket: "buncha",
        MaxKeys: 1,
        Delimiter: "/",
        Prefix: `img/${placeid}`
      };
      s3.listObjectsV2(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    return data.KeyCount > 0;
  } catch (err) {
    console.log({ existsInS3: err });
    return false;
  }
}

async function scaleImage(placeid, index, buffer, height) {
  const { data, info } = await sharp(buffer)
    .resize({ height })
    .toBuffer({ resolveWithObject: true });

  const key = `img/${placeid}/${index}-${height}.jpg`;

  await uploadImage(data, key);

  return {
    key,
    height: info.height,
    width: info.width
  };
}

async function uploadImage(buffer, key) {
  const params = {
    Bucket: "buncha",
    Key: key,
    Body: buffer
  };

  await new Promise((resolve, reject) => {
    s3.upload(params, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function createImage(placeid, photo, heights, index) {
  const url = `${photoBase}${photo.photo_reference}`;

  const res = await getImage(url);

  const [thumb, mid] = await Promise.all(
    heights.map(height => scaleImage(placeid, index, res.buffer, height))
  );

  return {
    full: {
      url: res.url,
      height: photo.height,
      width: photo.width
    },
    thumb,
    mid
  };
}

async function processImages(place) {
  const exists = await existsInS3(place.place_id);

  if (exists) {
    const doc = await elastic
      .search({
        index: event.index,
        type: event.type,
        body: {
          query: {
            term: { placeid: place.place_id }
          },
          size: 10
        }
      })
      .then(res => {
        return res.hits.hits.find(hit => hit._source.photos[0].thumb);
      });
    if (doc) {
      return doc._source.photos;
    }
  }

  const photoLinks = place.photos.map((photo, index) => {
    return createImage(place.place_id, photo, [400, 800], index);
  });

  const photos = await Promise.all(photoLinks);

  return photos;
}

module.exports = {
  processImages
};
