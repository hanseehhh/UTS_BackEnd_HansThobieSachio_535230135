const orderService = require('./order-service');
const { errorResponder, errorTypes } = require('../../../core/errors');


/**
 * Menampilkan List Dari GetOrder Yang Telah Dibentuk
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrderd(request, response, next) {
  try {
    const orderd = await orderService.getOrderd();
    
    return response.status(200).json(orderd);
  } catch (error) {
    return next(error);
  }
}


/**
 * Mengambil Data Order(dengan Lacak ID)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrder(request, response, next) {
  try {
    const order = await orderService.getOrder(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown Product');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}


/**
 * Membuat Pesanan Baru (Bisa Membuat Pesanan Yang Sama lebih dari 1)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createOrder(request, response, next) {
  try {
    const name = request.body.name;
    const quantity = request.body.quantity;

    const success = await orderService.createOrder(name, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Order'
      );
    }

    return response.status(200).json({ name, quantity, message: 'Pemesanan Sudah Masuk Proses' });
  } catch (error) {
    return next(error);
  }
}


/**
 * Mengatasi Perubahan Dari Pesanan (Bisa Update Berkali-Kali)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateOrder(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.params.name;
    const quantity = request.body.quantity;

    const success = await orderService.updateOrder(id, name, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update Product'
      );
    }

    return response.status(200).json({id, name, quantity, message: 'Pesanan Berhasil Di Perbaharui'});
  } catch (error) {
    return next(error);
  }
}


/**
 * Mengatasi Penghapusan(Delete) Pesanan 
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteOrder(request, response, next) {
  try {
    const id = request.params.id;

    const success = await orderService.deleteOrder(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete Product'
      );
    }

    return response.status(200).json({ id, message: 'Pesanan Telah Di-Cancle'});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
getOrderd,
getOrder,
createOrder,
updateOrder,
deleteOrder,
};