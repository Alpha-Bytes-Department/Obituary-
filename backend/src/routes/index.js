const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const memorialRoutes = require("./memorialRoutes");

function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/memorials", memorialRoutes);
}

module.exports = {
  registerRoutes,
};
