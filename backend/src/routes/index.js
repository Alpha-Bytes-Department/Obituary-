const authRoutes = require("./authRoutes");


function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
}

module.exports = {
  registerRoutes,
};
