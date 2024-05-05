const { Ecommerce } = require('../../../models');

/**
 * Mendapatkan Data Utuh Dari Product
 * @returns {Promise}
 */
async function getProducts() {
  return Ecommerce.find({});
}

/**
 * Mendapatkan Data Dari Product (by ID)
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Ecommerce.findById(id);
}

/**
 * Membuat Product Baru
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

/**
 * Meng-Update Product yang Sudah Ada
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} description - Deskripsi
 * @param {string} price - Harga
 * @param {string} stock - Stok Product
 * @returns {Promise}
 */
async function updateProduct(id, name, description, price, stock) {
  return Ecommerce.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        description,
        price,
        stock,
      },
    }
  );
}

/**
 * Delete Product Yang Sudah Ada
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Ecommerce.deleteOne({_id: id });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
