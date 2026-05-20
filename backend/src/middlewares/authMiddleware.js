/**
 * Middleware to verify JWT access tokens and attach user info to request.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
module.exports = (req, res, next) => {
  // TODO: implement token verification using jwtUtils
  next();
};
