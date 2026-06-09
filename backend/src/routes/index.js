const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const memorialRoutes = require("./memorialRoutes");

function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/memorials", memorialRoutes);
  app.use("/api/ads", require("./adminAdRoutes"));
  app.use("/api/condolences", require("./condolenceRoutes"));
  app.use("/api/donations", require("./donationRoutes"));
  app.use("/api/admin", require("./adminRoutes"));
}

module.exports = {
  registerRoutes,
};
