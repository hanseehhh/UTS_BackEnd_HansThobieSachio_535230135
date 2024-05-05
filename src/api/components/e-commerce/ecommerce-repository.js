const { Ecommerce } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getProducts() {
  return Ecommerce.find({});
}

/**
 * Get user detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Ecommerce.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} description - Deskripsi Product
 * @param {integer} price - Harga Product
 * @param {integer} stock - stock dari Product
 * @returns {Promise}
 */
async function createProduct(name, description, price, stock) {
  return Ecommerce.create({
    name,
    description,
    price,
    stock
  });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};
