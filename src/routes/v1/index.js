const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const accessRoute = require('./access.route');
const productRoute = require('./product.route');
const inventorytRoute = require('./inventory.route');
const discountRoute = require('./discount.route');
const cartRoute = require('./cart.route');
const checkoutRoute = require('./checkout.route');
const searchRoute = require('./search.route');
const commentRoute = require('./comment.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const { apiKey, permission } = require('../../middlewares/checkAuth');
const { pushToLogDiscord } = require('../../middlewares/logger.discord');
const router = express.Router();

const shopRoutes = [
  {
    path: '/comment',
    route: commentRoute,
  },
  {
    path: '/checkout',
    route: checkoutRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/discount',
    route: discountRoute,
  },
  {
    path: '/inventory',
    route: inventorytRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/shop',
    route: accessRoute,
  },
];

const userRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

// defaultRoutes.forEach((route) => {
//   router.use(apiKey, permission('0000'), route.path, route.route);
// });

userRoutes.forEach((route) => {
  router.use(route.path, pushToLogDiscord, route.route);
});

shopRoutes.forEach((route) => {
  router.use(route.path, pushToLogDiscord, apiKey, permission('0000'), route.route);
});

/* istanbul ignore next */
if (config.env === 'development' || config.env === 'production') {
  devRoutes.forEach((route) => {
    router.use(route.path, pushToLogDiscord, route.route);
  });
}

// router.use(apiKey);
// router.use(permission('0000'));

module.exports = router;
