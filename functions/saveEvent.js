const elastic = require("./elastic");
const servicesApi = require("./google");
const event = require("./schema/event");

const photoBase = `https://maps.googleapis.com/maps/api/place/photo?key=${
  process.env.GOOGLE
}&maxheight=800&photoreference=`;

function createEvent(req, res) {
  const {
    id,
    placeid,
    title,
    description,
    start,
    end,
    days,
    postCode
  } = req.body;

  if (postCode !== process.env.POSTCODE) {
    res.send({
      error: "Missing Post Code"
    });
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
        return fetch(url).then(res => res.url);
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

  placeQuery
    .then(place => {
      const {
        photos,
        international_phone_number: phone,
        name: location,
        geometry: {
          location: { lat, lng }
        },
        formatted_address: address,
        address_components
      } = place;

      const street = address_components.find(
        component => component.types.indexOf("route") > -1
      );

      const neighborhood = address_components.find(
        component => component.types.indexOf("neighborhood") > -1
      );

      const city = address_components.find(
        component => component.types.indexOf("locality") > -1
      );

      const coordinates = [lng, lat];

      const body = {
        title,
        description,
        days,
        start,
        end,
        placeid,
        location,
        address,
        coordinates,
        photos,
        phone,
        street: street && street.long_name,
        neighborhood: neighborhood && neighborhood.long_name,
        city: city && city.long_name
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

      return save;
    })
    .then(() => {
      res.send(200);
      return;
    })
    .catch(error => {
      res.send({
        error: error.message
      });
    });
}

module.exports = createEvent;
