const mongoose = require("mongoose");

const planetsShema = new mongoose.Schema({
  keplerName: { type: String, required: true },
});

const Planet = mongoose.model("Planet", planetsShema);

module.exports = Planet;
