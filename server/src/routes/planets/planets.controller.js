const Planet = require("../../models/planets.mongo");

async function getAllPlanets(req, res) {
  const planets = await Planet.find({}, "-__v -_id");
  return res.status(200).json(planets);
}

module.exports = { getAllPlanets };
