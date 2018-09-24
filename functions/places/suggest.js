const servicesApi = require("../google");

module.exports = function suggestPlaces(req, res) {
  const { input } = req.body;
  const query = { input };

  servicesApi.placesAutoComplete(query, (err, response) => {
    if (err) {
      res.send({
        error: err
      });
    }

    const details = response.json.predictions.map(prediction => {
      return new Promise((resolve, reject) => {
        const query = {
          placeid: prediction.place_id
        };
        servicesApi.place(query, (err, response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.json.result);
        });
      });
    });

    Promise.all(details)
      .then(values => {
        res.send({
          values
        });
        return;
      })
      .catch(error => {
        res.send({
          error
        });
      });
  });
};
