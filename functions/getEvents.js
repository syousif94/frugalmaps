const elastic = require("./elastic");
const event = require("./schema/event");
const servicesApi = require("./google");
const turf = require("@turf/turf");
const _ = require("lodash");
const moment = require("moment");
const { groupHours, makeEvents, makeMarkers, makeListData } = require("./time");

module.exports = async function getEvents(req, res) {
  const { lat, lng, now /** text, tags */ } = req.body;

  const currentTime = moment(now);

  let { bounds } = req.body;

  var city;

  const body = {
    query: {
      match_all: {}
    },
    size: 100
  };

  if (lat && lng) {
    const sort = {
      _geo_distance: {
        coordinates: [lng, lat],
        order: "asc",
        unit: "mi",
        distance_type: "plane"
      }
    };
    body.sort = [sort];
  }

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
  } else if (lat && lng) {
    body.query = {
      bool: {
        must: [{ match_all: {} }],
        filter: {
          geo_distance: {
            distance: "45mi",
            coordinates: [lng, lat]
          }
        }
      }
    };

    city = await getCity(lat, lng);
  }

  const data = await elastic
    .search({
      index: event.index,
      type: event.type,
      body
    })
    .then(results => {
      const points = results.hits.hits.map(doc =>
        turf.point(doc._source.coordinates)
      );

      if (lat && lng && !bounds) {
        points.push(turf.point([lng, lat]));
      }

      // create a bounding box for the results
      const envelope = turf.bbox(
        turf.buffer(turf.envelope(turf.featureCollection(points)), 0.5, {
          units: "miles"
        })
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

      return results.hits.hits.map(doc => {
        doc._source.photos = _(doc._source.photos)
          .shuffle()
          .value();

        doc._source.groupedHours = groupHours(doc._source, currentTime);

        return doc;
      });
    });

  const calendar = makeEvents(currentTime, data);

  let markerData = [{ title: "Up Next", data }, ...calendar];

  const markers = makeMarkers(currentTime, markerData);

  const listData = makeListData(calendar, currentTime);

  const list = [
    {
      title: "Up Next",
      data: listData
    }
  ];

  const response = {
    calendar,
    markers,
    data,
    list
  };

  if (bounds) {
    response.bounds = bounds;
  }

  if (city) {
    response.city = city;
  }

  res.send(response);
};

async function getCity(lat, lng) {
  const results = await new Promise((resolve, reject) => {
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

  const city = {
    text: undefined,
    bounds: undefined
  };

  let geocode = results.find(location => {
    return location.types.indexOf("locality") > -1;
  });

  if (!geocode) {
    geocode = results.find(location => {
      return location.types.indexOf("neighborhood") > -1;
    });
  } else {
    city.text = geocode.formatted_address;
    city.bounds = geocode.geometry.bounds;
  }

  if (!geocode) {
    geocode = results.find(location => {
      return location.types.indexOf("street_address") > -1;
    });
  }

  if (geocode && !city.text) {
    const locality = geocode.address_components.find(
      component => component.types.indexOf("locality") > -1
    );

    let state = geocode.address_components.find(
      component => component.types.indexOf("administrative_area_level_1") > -1
    );

    if (!state) {
      state = geocode.address_components.find(
        component => component.types.indexOf("country") > -1
      );
    }

    city.text = `${locality.long_name}, ${state.long_name}`;
  }

  return city;
}
