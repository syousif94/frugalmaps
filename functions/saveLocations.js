const _ = require("lodash");

const elastic = require("./elastic");
const servicesApi = require("./google");
const location = require("./schema/location");

const backup = require("./backupToS3");

module.exports = function saveLocations(city, state) {
  const cityAddress = `${city.long_name}, ${state.long_name}`;
  const cityID = _.kebabCase(cityAddress);

  const promises = [[cityID, cityAddress, "city"]].map(
    ([id, address, type]) => {
      return elastic
        .exists({
          index: location.index,
          type: location.type,
          id
        })
        .then(exists => {
          if (exists) {
            return;
          }

          return getGeometry(address).then(
            ({ placeid, bounds, location: coordinates }) => {
              const body = {
                name: address,
                type,
                placeid,
                bounds,
                coordinates
              };

              backup(`location/${id}`, body);

              return elastic.index({
                index: location.index,
                type: location.type,
                id,
                body
              });
            }
          );
        });
    }
  );

  return promises;
};

function getGeometry(address) {
  return new Promise((resolve, reject) => {
    servicesApi.geocode(
      {
        address
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else if (response.json.results.length) {
          const result = response.json.results[0];
          const bounds = result.geometry.bounds;
          const location = [
            result.geometry.location.lng,
            result.geometry.location.lat
          ];
          const placeid = result.place_id;
          resolve({
            bounds,
            location,
            placeid
          });
        } else {
          reject(new Error("Geocoding Failed"));
        }
      }
    );
  });
}
