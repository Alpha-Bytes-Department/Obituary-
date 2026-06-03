const mongoose = require("mongoose");

/**
 * Convert a Mongoose connection state into a readable label.
 *
 * @param {number} state
 * @returns {string}
 */
function dbStatusString(state) {
  return (
    {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }[state] || "unknown"
  );
}

/**
 * Attach common MongoDB connection event handlers.
 *
 * @returns {void}
 */
function registerDatabaseListeners() {
  mongoose.connection.on("error", (err) =>
    console.error("MongoDB error:", err),
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("MongoDB disconnected"),
  );
  mongoose.connection.on("reconnected", () =>
    console.log("MongoDB reconnected"),
  );
}

/**
 * Connect the application to MongoDB when a URI is available.
 *
 * @param {string} mongoUri
 * @returns {Promise<void>}
 */
async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    console.error("MongoDB connection error: MONGO_URI is not set");
    return;
  }

  registerDatabaseListeners();

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);

    if (err && err.code === "ECONNREFUSED" && err.syscall === "querySrv") {
      console.error(
        "DNS SRV lookup failed for the MongoDB Atlas host. Check the connection string, network access, and DNS availability.",
      );
    }
  }
}

module.exports = {
  connectDatabase,
  dbStatusString,
};