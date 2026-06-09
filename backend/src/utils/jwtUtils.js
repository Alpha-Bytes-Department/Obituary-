const jwt = require("jsonwebtoken");

/**
 * Create access token
 *
 * @param {object} payload
 * @returns {string}
 */
exports.createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "55m",
  });
};


exports.createRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    { expiresIn: "7d" },
  );
};

/**
 * Verify token
 *
 * @param {string} token
 * @param {string} secret
 * @returns {object}
 */
exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};


exports.createOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
