require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = (process.env.MONGO_URI || "").trim();

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

// ================== Database Connection ==================
connectDatabase(MONGO_URI);

// ================== API Routes ==================
registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
