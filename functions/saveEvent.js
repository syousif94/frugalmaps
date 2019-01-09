const elastic = require("./elastic");
const moment = require("moment");
const servicesApi = require("./google");
const event = require("./schema/event");
const indexLocations = require("./saveLocations");
const { db } = require("./firebase.js");

const photoBase = `https://maps.googleapis.com/maps/api/place/photo?key=${
  process.env.GOOGLE
}&maxheight=800&photoreference=`;

function formatTime(str) {
  const date = moment(str, ["h:ma", "H:m"]);
  const isValid = date.isValid();
  if (isValid) {
    const str = date.format("HHmm");
    return str;
  } else {
    throw new Error("Invalid Time");
  }
}

async function createEvent(req, res) {
  const {
    id,
    fid,
    placeid,
    title,
    description,
    start,
    end,
    days,
    postCode,
    type
  } = req.body;

  if (postCode !== process.env.POSTCODE) {
    if (id || fid || postCode !== "") {
      res.send({
        error: "Invalid Code"
      });
      return;
    }

    const doc = {
      placeid,
      title,
      description,
      days,
      type
    };

    if (start) {
      doc.start = start;
    }
    if (end) {
      doc.end = end;
    }

    await db.collection("submissions").add(doc);

    res.send(doc);
    return;
  }

  const placeQuery = new Promise((resolve, reject) => {
    const query = {
      placeid
    };
    servicesApi.place(query, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      const place = response.json.result;

      const photoLinks = place.photos.map(photo => {
        const url = `${photoBase}${photo.photo_reference}`;
        return fetch(url).then(res => ({
          url: res.url,
          height: photo.height,
          width: photo.width
        }));
      });

      Promise.all(photoLinks)
        .then(links => {
          place.photos = links;
          resolve(place);
          return;
        })
        .catch(error => {
          reject(error);
        });
    });
  });

  try {
    const {
      photos,
      international_phone_number: phone,
      name: location,
      geometry: {
        location: { lat, lng },
        viewport
      },
      formatted_address: address,
      address_components,
      price_level: priceLevel,
      rating,
      website,
      url,
      opening_hours: { periods, weekday_text: hours }
    } = await placeQuery;

    const neighborhood = address_components.find(
      component => component.types.indexOf("neighborhood") > -1
    );

    const city = address_components.find(
      component => component.types.indexOf("locality") > -1
    );

    let state = address_components.find(
      component => component.types.indexOf("administrative_area_level_1") > -1
    );

    if (!state) {
      state = address_components.find(
        component => component.types.indexOf("country") > -1
      );
    }

    const coordinates = [lng, lat];

    let cityText;
    if (city && state) {
      cityText = `${city.long_name}, ${state.long_name}`;
    }

    let neighborhoodText;
    if (neighborhood && cityText) {
      neighborhoodText = `${neighborhood.long_name}, ${cityText}`;
    }

    let startTime;
    let endTime;

    if (start) {
      startTime = formatTime(start);
    }
    if (end) {
      endTime = formatTime(end);
    }

    const body = {
      updatedAt: Date.now(),
      title,
      description,
      days,
      start: startTime,
      end: endTime,
      type,
      url,
      rating,
      priceLevel,
      periods,
      hours,
      placeid,
      location,
      address,
      coordinates,
      viewport,
      photos,
      phone,
      website,
      neighborhood: neighborhoodText,
      city: cityText,
      state: state && state.long_name,
      shortState: state && state.short_name
    };

    let save;

    if (id) {
      save = elastic.update({
        index: event.index,
        type: event.type,
        id,
        body: {
          doc: body
        }
      });
    } else {
      save = elastic.index({
        index: event.index,
        type: event.type,
        body
      });
    }

    const saveLocations = indexLocations(city, state);

    const [{ _id }] = await Promise.all([save, ...saveLocations]);

    if (fid) {
      await db
        .collection("submissions")
        .doc(fid)
        .delete();
    }

    res.send({
      _id,
      _source: body
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

module.exports = createEvent;
