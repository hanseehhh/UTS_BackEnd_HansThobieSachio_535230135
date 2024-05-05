const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const orderController = require('./order-controller');
const orderValidator = require('./order-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/order', route);

  // ROUTE UNTUK MELAKUKAN GET /ORDER
  route.get('/', authenticationMiddleware, orderController.getOrderd);


  //ROUTE UNTUK MELAKUKAN PERUBAHAN Pesanan POST /ORDER
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(orderValidator.createOrder),
    orderController.createOrder
  );


  // ROUTE UNTUK MELAKUKAN GET DATA BY ID GET /ORDER/ID
  route.get('/:id', authenticationMiddleware, orderController.getOrder);


  // ROUTE UNTUK MELAKUKAN UPDATE PADA Pesanan PUT /ORDER/ID
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(orderValidator.updateOrder),
    orderController.updateOrder
  );

  
  // // ROUTE UNTUK MENGHAPUS Pesana DELETE /ORDER/ID
  route.delete('/:id', authenticationMiddleware, orderController.deleteOrder);


};