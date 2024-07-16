const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const manufactureRoute = require('./manufacture.route');
const invitationsRoute = require('./invitation.route');
const wholesalerRoute = require('./wholesaler.route');
const clothingMensRoute = require('./clothing.mens.route');
const materialRoute = require('./material.route');
const patternRoute = require('./pattern.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/manufacturers',
    route: manufactureRoute,
  },
  {
    path: '/invitations',
    route: invitationsRoute,
  },
  {
    path: '/wholesaler',
    route: wholesalerRoute,
  },
  {
    path: '/clothing-mens',
    route: clothingMensRoute,
  },
  {
    path: '/material',
    route: materialRoute,
  },
  {
    path: '/pattern',
    route: patternRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
