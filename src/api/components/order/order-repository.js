const { Order } = require('../../../models');

/**
 * Mendapatkan Data Utuh Dari Order
 * @returns {Promise}
 */
async function getOrderd() {
  return Order.find({});
}

/**
 * Mendapatkan Data Dari Order (by ID)
 * @param {string} id - Order ID
 * @returns {Promise}
 */
async function getOrder(id) {
  return Order.findById(id);
}

/**
 * Membuat Pesanan Baru
 * @param {string} name - Name Pesanan
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
 * Meng-Update Pesanan yang Sudah Ada
 * @param {string} id - Order ID
 * @param {string} name - Name Pesanan
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
 * Delete Pesaan Yang Sudah Dibentuk
 * @param {string} id - Order ID
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
