const joi = require('joi');
const { updateOrder, createOrder } = require('./order-repository');


module.exports = {
  createOrder: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      quantity: joi.number().integer().required().label('Quantity'),
    },
  },

  updateOrder: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      quantity: joi.number().integer().required().label('Quantity'),
    },
  },
};