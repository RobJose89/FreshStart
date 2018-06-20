/*
 * You can provide multiple Express callback functions that behave just like middleware, except that
 * these callbacks can invoke next('route') to bypass the remaining route callback(s). You can use
 * this mechanism to impose pre-conditions on a route, then pass control to subsequent routes if
 * there is no reason to proceed with the current route.
*/

const jwtMiddleware = require('express-jwt');
const { compose } = require('compose-middleware');

const security = compose(
  jwtMiddleware({
    secret: process.env.API_KEY,
    getToken: (req) => req.query.token,
  }),
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.json({
        code: 401,
        message: 'Login has expired.',
        error: {
          token: 'expired',
        },
      });
      return;
    }
    next(); // pass control to the next handler
  }
);

const onlyApi = (req, res, next) => {
  if (req.user.isApi) {
    next(); // pass control to the next handler
    return;
  }
  res.json({
    code: 403,
    message: 'Access denied.',
    error: {
      access: 'denied',
    },
  });
};

const onlyAdmin = (req, res, next) => {
  if (!req.user.isApi) {
    next(); // pass control to the next handler
    return;
  }
  res.json({
    code: 403,
    message: 'Access denied.',
    error: {
      access: 'denied',
    },
  });
};

module.exports = {
  onlyApi,
  onlyAdmin,
  security,
};
