const elastic = require("./elastic");
const event = require("./schema/event");
const servicesApi = require("./google");

function queryEvents(req, res) {
  const { bounds, lat, lng } = req.body;

  const body = {
    query: {
      match_all: {}
    },
    size: 99
  };

  let text;

  let query;

  if (bounds) {
    const { northeast, southwest } = bounds;

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
          latlng: [lat, lng],
          result_type: ["locality"]
        },
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(response.json.results[0]);
        }
      );
    });
    query = reverseGeocode.then(geocode => {
      text = geocode.formatted_address;

      const { northeast, southwest } = geocode.geometry.bounds;

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

      return elastic.search({
        index: event.index,
        type: event.type,
        body
      });
    });
  } else {
    text = "Most Recent";
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
        hits
      });
    })
    .catch(error => {
      res.send({
        error: error.message
      });
    });
}

module.exports = queryEvents;
