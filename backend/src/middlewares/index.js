const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

/**
 * Register the global middleware stack.
 *
 * @param {import("express").Express} app
 * @returns {void}
 */
function registerMiddlewares(app) {
  app.use(helmet());
  app.use(morgan("dev"));

  const configuredOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || "").split(","),
  ]
    .map((origin) => origin?.trim())
    .filter(Boolean);

  const allowedOrigins = new Set([
    "https://qbits-demo.vercel.app",
    "http://72.60.20.226",
    "http://localhost:4000",
    "http://localhost:3000",
    ...configuredOrigins,
  ]);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
}

module.exports = {
  registerMiddlewares,
};
