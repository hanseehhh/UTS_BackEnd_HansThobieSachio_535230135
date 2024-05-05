const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getProducts() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} description - Deskripsi Product
 * @param {string} price - Harga Product
 * @param {string} stock - stock dari Product
 * @returns {Promise}
 */
async function createProduct(name, description, price, stock) {
  return product.create({
    name,
    description,
    price,
    stock,
  });
}


/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} description - Deskripsi
 * @param {string} price - Harga
 * @param {string} stock - Stok Product
 * @returns {Promise}
 */
async function updateProduct(id, name, description, price, stock) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
        description,
        price,
        stock,
      },
    }
  );
}

/**
 * Delete a Product
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
