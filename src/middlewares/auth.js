const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { MANUFACTURER_STAFF_ROLES } = require('../middlewares/roleGroup');

// const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
//   if (err || info || !user) {
//     return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//   }
//   req.user = user;
//   if (requiredRights.length) {
//     const userRights = req.user.role;
//     // const hasRequiredRights = requiredRights[0].includes(userRights);
//     const hasRequiredRights = requiredRights.some((requiredRight) => requiredRight.includes(userRights));
//     if (!hasRequiredRights && req.params.userId !== user.id) {
//       return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
//     }
//   }
//   resolve();
// };

// const auth =
//   (...requiredRights) =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

// module.exports = auth;
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = user;

  if (requiredRights.length) {
    let effectiveRole = req.user.role;

    if (req.user.createdBy && MANUFACTURER_STAFF_ROLES.includes(req.user.role)) {
      effectiveRole = 'manufacture';
    }

    const hasRequiredRights = requiredRights.includes(effectiveRole);

    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
