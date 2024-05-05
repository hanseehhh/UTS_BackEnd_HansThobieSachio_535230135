const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ecommerceControllers = require('./order-controller');
const ecommerceValidator = require('./order-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/order', route);

  // ROUTE UNTUK MELAKUKAN GET /PRODUCT
  route.get('/', authenticationMiddleware, ecommerceControllers.getProducts);

  // ROUTE UNTUK MELAKUKAN PERUBAHAN PRODUCT POST /PRODUCT
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(ecommerceValidator.createProduct),
    ecommerceControllers.createProduct
  );

  // ROUTE UNTUK MELAKUKAN GET DATA BY ID GET /PRODUCT/ID
  route.get('/:id', authenticationMiddleware, ecommerceControllers.getProduct);

  // ROUTE UNTUK MELAKUKAN UPDATE PADA PRODUCT PUT /PRODUCT/ID
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(ecommerceValidator.updateProduct),
    ecommerceControllers.updateProduct
  );

  // ROUTE UNTUK MENGHAPUS PRODUCT DELETE /PRODUCT/ID
  route.delete('/:id', authenticationMiddleware, ecommerceControllers.deleteProduct);


};