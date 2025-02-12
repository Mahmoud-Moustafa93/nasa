const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connection.once("open", () =>
  console.log("💥 Successfully connected to the database")
);

mongoose.connection.on("error", (err) =>
  console.error("⛔ Error connecting to the database: ", err)
);

// Using this try{} catch(err){} approach, you ensure that errors during the connection attempt are handled upfront in mongoConnect(), while still having the event listeners in place to manage any issues that occur during the connection’s lifetime.
async function mongoConnect() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    console.error("⛔ Error connecting to the database:", error);
    process.exit(1);
  }
}

async function mongoDisconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error("⛔ Error disconnecting from the database:", error);
    process.exit(1);
  }
}

module.exports = { mongoConnect, mongoDisconnect };
