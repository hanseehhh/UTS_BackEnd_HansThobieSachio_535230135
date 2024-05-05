const ecommerceRepository = require('./ecommerce-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { User } = require('../../../models');
const { result } = require('lodash');

async function getProducts() {
  const products = await ecommerceRepository.getProducts();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  }

  return results;
}


async function getProduct(id){
  const product = await ecommerceRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  };
}

/**
 * Create New Product
 * @param {string} name - Name
 * @param {string} description - Deskripsi
 * @param {string} price - Harga Product
 * @param {string} stock - Stock Product
 * @returns {boolean}
 */
async function createProduct(name, description, price, stock) {

  try {
    await ecommerceRepository.createProduct(name, description, price, stock);

  } 
    catch (err) {
    return null;
    }
  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} description - Deskripsi
 * @param {string} price - Harga
 * @param {string} stock - Stock
 * @returns {boolean}
 */
async function updateProduct(id, name, description, price, stock) {
  const product = await ecommerceRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await ecommerceRepository.updateProduct(id, name, description, price, stock);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await ecommerceRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await ecommerceRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,

};