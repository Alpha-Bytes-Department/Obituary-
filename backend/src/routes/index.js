const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");

function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
}

module.exports = {
  registerRoutes,
};
