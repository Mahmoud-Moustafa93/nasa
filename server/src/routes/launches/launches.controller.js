const Launch = require("../../models/launches.mongo");
const Planet = require("../../models/planets.mongo");
const { getPagination } = require("../../services/query");

async function getAllLaunches(req, res) {
  const { limit, skip } = getPagination(req.query);
  const launches = await Launch.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json(launches);
}

async function addNewLaunch(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target)
    return res
      .status(400)
      .json({ status: "error", message: "Missing required launch property" });

  const launchDate = new Date(launch.launchDate);

  if (isNaN(launchDate))
    return res
      .status(400)
      .json({ status: "error", message: "Invalid launch date" });

  const latestLaunch = await Launch.findOne().sort("-flightNumber");

  const newFlightNumber = latestLaunch ? latestLaunch.flightNumber + 1 : 100;

  if (!(await Planet.findOne({ keplerName: launch.target })))
    return res
      .status(400)
      .json({ status: "error", message: "No matching planet was found" });

  const newLaunch = {
    launchDate,
    flightNumber: newFlightNumber,
    mission: launch.mission,
    rocket: launch.rocket,
    target: launch.target,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };

  Launch.create(newLaunch);

  return res.status(201).json(newLaunch);
}

async function deleteLaunch(req, res) {
  const launchId = +req.params.id;
  const launch = await Launch.findOne({ flightNumber: launchId });

  if (!launch) return res.status(404).json({ error: "Launch not found" });

  const updatedLaunch = await Launch.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );
  const aborted = updatedLaunch.modifiedCount === 1;

  if (!aborted)
    return res.status(400).json({ error: "Launch already has been aborted" });

  return res.status(200).json({ ok: true });
}

async function deleteLaunchDatabase(req, res) {
  const launchId = +req.params.id;
  const launch = await Launch.findOne({ flightNumber: launchId });

  if (!launch) return res.status(404).json({ error: "Launch not found" });

  await Launch.deleteOne({ flightNumber: launchId });

  return res.status(204).json({
    status: "success",
    data: null,
  });
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
  deleteLaunchDatabase,
};
