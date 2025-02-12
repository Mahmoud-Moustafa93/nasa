const Launch = require("./launches.mongo");
const Planet = require("./planets.mongo");

require("dotenv").config();

async function saveLaunch(launchData) {
  await Launch.findOneAndUpdate(
    {
      flightNumber: launchData.flightNumber,
    },
    launchData,
    { upsert: true }
  );
}

async function loadLaunchData() {
  try {
    const firstLaunch = await Launch.findOne({ flightNumber: 1 });
    if (firstLaunch)
      return console.log("Launch data already exists in the database");

    // Populate launch data
    const launchData = await downloadLaunchData();

    for (const launch of launchData) await saveLaunch(launch);
  } catch (err) {
    console.error("Error loading launch data: ", err);
  }
}

async function downloadLaunchData() {
  console.log("Downloading launch data...");

  const res = await fetch(process.env.SPACEX_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {},
      options: {
        pagination: false,
        populate: [
          { path: "rocket", select: "name" },
          { path: "payloads", select: "customers" },
        ],
      },
    }),
  });

  const data = await res.json();

  const launchData = data.docs.map((launch) => {
    const spaceXLaunch = {
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: new Date(launch.date_local),
      customers: launch.payloads.flatMap((payload) => payload.customers),
      upcoming: launch.upcoming,
      success: launch.success,
    };
    // console.log(`${spacexLaunch.flightNumber}: ${spacexLaunch.mission}`);

    return spaceXLaunch;
  });

  return launchData;
}

module.exports = { loadLaunchData };
