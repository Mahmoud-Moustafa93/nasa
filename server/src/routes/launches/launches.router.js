const express = require("express");

const {
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
  deleteLaunchDatabase,
} = require("./launches.controller");

const router = express.Router();

router.route("/").get(getAllLaunches).post(addNewLaunch);
router.route("/:id").delete(deleteLaunch);
router.route("/database/:id").delete(deleteLaunchDatabase);

module.exports = router;
