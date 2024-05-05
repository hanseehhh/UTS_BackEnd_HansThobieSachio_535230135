const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const orderController = require('./order-controller');
const orderValidator = require('./order-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/order', route);

  // ROUTE UNTUK MELAKUKAN GET /PRODUCT
  route.get('/', authenticationMiddleware, orderController.getOrderd);

  //ROUTE UNTUK MELAKUKAN PERUBAHAN PRODUCT POST /PRODUCT
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(orderValidator.createOrder),
    orderController.createOrder
  );

  // ROUTE UNTUK MELAKUKAN GET DATA BY ID GET /PRODUCT/ID
  route.get('/:id', authenticationMiddleware, orderController.getOrder);

  // ROUTE UNTUK MELAKUKAN UPDATE PADA PRODUCT PUT /PRODUCT/ID
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(orderValidator.updateOrder),
    orderController.updateOrder
  );

  // // ROUTE UNTUK MENGHAPUS PRODUCT DELETE /PRODUCT/ID
  route.delete('/:id', authenticationMiddleware, orderController.deleteOrder);


};