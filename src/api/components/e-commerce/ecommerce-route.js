const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ecommerceController = require('./ecommerce-controller');
const eccomerceValidator = require('./ecommerce-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, ecommerceController.getProducts);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(eccomerceValidator.createProduct),
    ecommerceController.createProduct
  );

  // // Get user detail
  // route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // // Update user
  // route.put(
  //   '/:id',
  //   authenticationMiddleware,
  //   celebrate(usersValidator.updateUser),
  //   usersControllers.updateUser
  // );

  // // Delete user
  // route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // // Change password
  // route.post(
  //   '/:id/change-password',
  //   authenticationMiddleware,
  //   celebrate(usersValidator.changePassword),
  //   usersControllers.changePassword
  // );
};
