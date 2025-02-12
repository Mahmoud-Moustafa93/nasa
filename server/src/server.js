const http = require("node:http");
const mongoose = require("mongoose");
require("dotenv").config();

process.on("uncaughtException", function (err) {
  console.log("uncaughtException! ⛔ Shutting down server...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const { mongoConnect } = require("./services/mongo");

const port = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(port, () => console.log(`App running on port ${port}...`));
}
startServer();

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection! ⛔ Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
