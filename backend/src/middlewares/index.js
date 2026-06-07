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
   const allowedOrigins = [
     "https://qbits-demo.vercel.app",
     "http://localhost:4000",
     "http://localhost:3000",
   ];
   app.use(
     cors({
       origin: (origin, callback) => {
         if (!origin || allowedOrigins.includes(origin)) {
           callback(null, true);
         } else {
           callback(new Error("Not allowed by CORS"));
         }
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
