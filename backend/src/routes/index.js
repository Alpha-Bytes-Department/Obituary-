const authRoutes = require("./authRoutes");

/**
 * Register the application route groups.
 *
 * @param {import("express").Express} app
 * @returns {void}
 */
function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
}

module.exports = {
  registerRoutes,
};