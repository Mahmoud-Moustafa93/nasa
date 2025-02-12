const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("csv-parse");

const Planet = require("./planets.mongo");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "../../data/kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const habitablePlanetsFound = (await Planet.find()).length;
        console.log(`${habitablePlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function savePlanet(planetData) {
  try {
    await Planet.updateOne(
      {
        keplerName: planetData.kepler_name,
      },
      {
        keplerName: planetData.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet: ${err}`);
  }
}

module.exports = { loadPlanetsData };
