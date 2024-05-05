  const express = require('express');

  const authentication = require('./components/authentication/authentication-route');
  const users = require('./components/users/users-route');
  const product = require('./components/e-commerce/ecommerce-route');       // MENAMBAHKAN ROUTE UNTUK /product
  const order = require('./components/order/order-route')

  module.exports = () => {
    const app = express.Router();

    authentication(app);
    users(app);
    product(app);                                                           // CALLBACK module product
    order(app);

    return app;
  };
