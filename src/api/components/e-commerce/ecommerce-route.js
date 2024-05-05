const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ecommerceControllers = require('./ecommerce-controller');
const ecommerceValidator = require('./ecommerce-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/product', route);

  // Get list of Product
  route.get('/', authenticationMiddleware, ecommerceControllers.getProducts);

  // Create Product
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(ecommerceValidator.createProduct),
    ecommerceControllers.createProduct
  );

  // Get Product detail
  // route.get('/:id', authenticationMiddleware, ecommerceControllers.geProducts);

  //Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(ecommerceValidator.updateProduct),
    ecommerceControllers.updateProduct
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, ecommerceControllers.deleteProduct);


};
