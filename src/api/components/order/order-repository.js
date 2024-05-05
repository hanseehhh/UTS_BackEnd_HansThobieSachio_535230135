const { Order } = require('../../../models');

/**
 * Mendapatkan Data Utuh Dari Product
 * @returns {Promise}
 */
async function getOrderd() {
  return Order.find({});
}

/**
 * Mendapatkan Data Dari Product (by ID)
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getOrder(id) {
  return Order.findById(id);
}

/**
 * Membuat Product Baru
 * @param {string} name - Name
 * @param {string} quantity - Jumlah Pesanan
 * @returns {Promise}
 */
async function createOrder(name, quantity) {
  return Order.create({
    name,
    quantity,
  });
}

/**
 * Meng-Update Product yang Sudah Ada
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} quantity - Jumlah Pesanan
 * @returns {Promise}
 */
async function updateOrder(id, name, quantity) {
  return Order.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        quantity
      },
    }
  );
}

/**
 * Delete Product Yang Sudah Ada
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteOrder(id) {
  return Order.deleteOne({_id: id });
}


module.exports = {
  getOrderd,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
