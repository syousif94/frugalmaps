const elastic = require("./elastic");
const event = require("./schema/event");
const servicesApi = require("./google");
const turf = require("@turf/turf");

function queryEvents(req, res) {
  const { bounds: queryBounds, lat, lng } = req.body;

  const body = {
    query: {
      match_all: {}
    },
    size: 99
  };

  let text;

  let query;

  let bounds;

  if (queryBounds) {
    const { northeast, southwest } = queryBounds;

    const coordinates = {
      top_left: [southwest.lng, northeast.lat],
      bottom_right: [northeast.lng, southwest.lat]
    };

    body.query = {
      bool: {
        must: [{ match_all: {} }],
        filter: {
          geo_bounding_box: {
            coordinates
          }
        }
      }
    };

    query = elastic.search({
      index: event.index,
      type: event.type,
      body
    });
  } else if (lat && lng) {
    const reverseGeocode = new Promise((resolve, reject) => {
      servicesApi.reverseGeocode(
        {
          latlng: [lat, lng]
        },
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(response.json.results);
        }
      );
    });
    query = reverseGeocode.then(results => {
      let geocode = results.find(location => {
        return location.types.indexOf("locality") > -1;
      });

      if (!geocode) {
        geocode = results.find(location => {
          return location.types.indexOf("neighborhood") > -1;
        });
      } else {
        text = geocode.formatted_address;
        bounds = geocode.geometry.bounds;
      }

      if (!geocode) {
        geocode = results.find(location => {
          return location.types.indexOf("street_address") > -1;
        });
      }

      if (geocode && !text) {
        const city = geocode.address_components.find(
          component => component.types.indexOf("locality") > -1
        );

        let state = geocode.address_components.find(
          component =>
            component.types.indexOf("administrative_area_level_1") > -1
        );

        if (!state) {
          state = geocode.address_components.find(
            component => component.types.indexOf("country") > -1
          );
        }

        text = `${city.long_name}, ${state.long_name}`;
      }

      body.query = {
        bool: {
          must: [{ match_all: {} }],
          filter: {
            geo_distance: {
              distance: "20mi",
              coordinates: [lng, lat]
            }
          }
        }
      };

      return elastic
        .search({
          index: event.index,
          type: event.type,
          body
        })
        .then(results => {
          if (!bounds) {
            const envelope = turf.bbox(
              turf.buffer(
                turf.envelope(
                  turf.featureCollection([
                    ...results.hits.hits.map(doc =>
                      turf.point(doc._source.coordinates)
                    ),
                    turf.point([lng, lat])
                  ])
                ),
                0.5,
                { units: "miles" }
              )
            );

            bounds = {
              southwest: {
                lat: envelope[1],
                lng: envelope[0]
              },
              northeast: {
                lat: envelope[3],
                lng: envelope[2]
              }
            };
          }
          return results;
        });
    });
  } else {
    text = "Recently Added";
    query = elastic.search({
      index: event.index,
      type: event.type,
      body
    });
  }

  query
    .then(results => {
      const hits = results.hits.hits;

      res.send({
        text,
        hits,
        bounds
      });
    })
    .catch(error => {
      res.send({
        error: error.message
      });
    });
}

module.exports = queryEvents;