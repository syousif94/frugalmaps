const servicesApi = require("../google");

module.exports = async function getPlaceById(req, res) {
  try {
    const { placeid } = req.body;

    if (!placeid) {
      throw new Error("Missing Placeid");
    }

    const restaurant = await new Promise((resolve, reject) => {
      const query = {
        placeid
      };
      servicesApi.place(query, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response.json.result);
      });
    });

    res.send({
      restaurant
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
