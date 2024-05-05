const joi = require('joi');


module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().max(500).required().label('Description'),
      price: joi.number().integer().required().label('Price'),
      stock: joi.number().required().label('Stock'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().max(500).required().label('Description'),
      price: joi.number().integer().required().label('Price'),
      stock: joi.number().integer().required().label('Stock'),
    },
  },
};