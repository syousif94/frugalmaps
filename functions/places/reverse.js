const servicesApi = require("../google");

module.exports = function reverseLocation(req, res) {
  const { lat, lng } = req.body;

  servicesApi.reverseGeocode(
    {
      latlng: [lat, lng],
      result_type: ["locality"]
    },
    (err, response) => {
      if (err) {
        res.send({
          error: err.message
        });
        return;
      }

      res.send({
        city: response.json.results[0]
      });
    }
  );
};
