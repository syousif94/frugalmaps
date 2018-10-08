const elastic = require("./elastic");
const servicesApi = require("./google");
const event = require("./schema/event");
const indexLocations = require("./saveLocations");

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
    postCode,
    type
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
        address_components,
        price_level: priceLevel,
        rating,
        website,
        url,
        opening_hours: { periods, weekday_text: hours }
      } = place;

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

      const body = {
        title,
        description,
        days,
        start,
        end,
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
        photos,
        phone,
        website,
        neighborhood: neighborhood && neighborhood.long_name,
        city: city && city.long_name,
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

      return Promise.all([save, ...saveLocations]);
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
