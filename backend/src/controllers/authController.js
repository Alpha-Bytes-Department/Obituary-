/**
 * Auth controller - handles registration, login and token refresh.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON responses for auth actions.
 */

exports.register = async (req, res) => {
  // TODO: implement registration using bcryptjs and mongoose User model
  res.status(501).json({ message: "Not implemented" });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  // TODO: implement login, issue access token and set refresh cookie
  res.status(501).json({ message: "Not implemented" });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
exports.refreshToken = async (req, res) => {
  // TODO: validate refresh token from HttpOnly cookie and issue new access token
  res.status(501).json({ message: "Not implemented" });
};
