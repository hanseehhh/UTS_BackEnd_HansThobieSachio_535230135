const ecommerceService = require('./ecommerce-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { filter } = require('lodash');




/**
 * Mengambil Data Product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function getProducts(request, response, next){
  try {
    const products = await ecommerceService.getProducts();

    return response.status(200).json(products);
  }
    catch (error) {
    return next(error);
    }
}


/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await ecommerceService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown Product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const stock = request.body.stock;

    const success = await ecommerceService.createProduct(name, description, price, stock);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create Product'
      );
    }

    return response.status(200).json({ name, description, price, stock, message: 'Product Berhasil Di Buat' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const description = request.body.description;
    const price = request.body.price;
    const stock = request.body.stock;


    const success = await ecommerceService.updateProduct(id, description, price, stock);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update Product'
      );
    }

    return response.status(200).json({id, description, price, stock, message: 'Product Berhasil Di Perbaharui'});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ecommerceService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete Product'
      );
    }

    return response.status(200).json({ id, message: 'Product Berhasil Di Hapus'});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};