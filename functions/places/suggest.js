const base = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${
  process.env.GOOGLE
}`;

module.exports = async function suggestPlaces(req, res) {
  const query = req.body.query;

  const url = `${base}&${query}`;

  try {
    const values = await fetch(url)
      .then(res => res.json())
      .then(json => json.predictions);

    res.send({
      values
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
};
