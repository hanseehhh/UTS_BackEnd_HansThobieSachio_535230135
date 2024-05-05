const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { description } = require('../../../models/ecommerce-schema');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().max(500).required().label('Description'),
      price: joi.number().integer().required().label('Price'),
      stock: joi.number().required().label('Stock'),
    },
  },

  // updateUser: {
  //   body: {
  //     name: joi.string().min(1).max(100).required().label('Name'),
  //     description: joi.string().max(500).required().label('Description'),
  //     price: joi.number().integer().required().label('Price'),
  //     stock: joi.number().required().label('Stock'),
  //   },
  // },
};