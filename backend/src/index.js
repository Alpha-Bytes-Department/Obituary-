require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = (process.env.MONGO_URI || "").trim();
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000")
  .trim()
  .replace(/\/$/, "");

const { connectDatabase, dbStatusString } = require("./config/db");
const { registerMiddlewares } = require("./middlewares");
const { registerRoutes } = require("./routes");

// ================== Global Middleware ==================
registerMiddlewares(app);

// ================== Health Check ==================
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({ status: "ok", db: dbStatusString(state) });
});

// Friendly redirects for browser visits that accidentally hit the API server.
app.get(["/memorials", "/obituary"], (req, res) => {
  res.redirect(307, `${FRONTEND_URL}/obituary`);
});

app.get("/memorial", (req, res) => {
  res.redirect(307, `${FRONTEND_URL}/memorial`);
});

// ================== Database Connection ==================
connectDatabase(MONGO_URI);

// ================== API Routes ==================
registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
