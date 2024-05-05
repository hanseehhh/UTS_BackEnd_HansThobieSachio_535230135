const { quantity } = require('../../../models/order-schema');
const orderRepository = require('./order-repository');

/**
 * MENDAPATKAN LIST DARI ORDER BERUPA ARRAY
 * @returns {Array}
 */
async function getOrderd() {
  const orderd = await orderRepository.getOrderd();

  const results = [];
  for (let i = 0; i < orderd.length; i += 1) {
    const order = orderd[i];
    results.push({
      id: order.id,
      name: order.name,
      quantity: order.quantity,
    });
  }

  return results;
}


/**
 * MENDAPATKAN DETIL DARI ORDER (BY ID)
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getOrder(id){
  const order = await orderRepository.getOrder(id);

  // User not found
  if (!order) {
    return null;
  }

  return {
    id: order.id,
    name: order.name,
    quantity: order.quantity
  };
}


/**
 * MEMBUAT PESANAN BARU
 * @param {string} name - Product Name
 * @param {string} description - Deskripsi
 * @param {string} price - Harga Product
 * @param {string} stock - Stock Product
 * @returns {boolean}
 */
async function createOrder(name, quantity) {

  try {
    await orderRepository.createOrder(name, quantity);

  } 
    catch (err) {
    return null;
    }
  return true;
}


/**
 * MEMPERBAHARUI (UPDATE) PESANAN YANG SUDAH ADA
 * @param {string} id - Product ID
 * @param {string} name - Product Name
 * @param {string} quantity - Jumlah Pesanan
 * @returns {boolean}
 */
async function updateOrder(id, name, quantity) {
  const order = await orderRepository.getOrder(id);

  // User not found
  if (!order) {
    return null;
  }

  try {
    await orderRepository.updateOrder(id, name, quantity);
  } catch (err) {
    return null;
  }

  return true;
}


/**
 * MENGHAPUS (DELETE) PESANAN YANG SUDAH ADA
 * @param {string} id - Product ID
 * @returns {boolean}
 */
async function deleteOrder(id) {
  const order = await orderRepository.getOrder(id);

  // User not found
  if (!order) {
    return null;
  }

  try {
    await orderRepository.deleteOrder(id);
  } catch (err) {
    return null;
  }

  return true;
}


module.exports = {
  getOrderd,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,

};