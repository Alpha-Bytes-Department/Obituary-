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
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
}

module.exports = {
  registerMiddlewares,
};