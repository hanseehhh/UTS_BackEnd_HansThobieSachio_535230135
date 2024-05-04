const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');

let attempts = 0;
let lockedUntil = undefined;

const maxCoba = 5;
const timeOut = 30 * 60 * 1000; // 30 menit dalam milidetik

async function login(request, response, next) {
  const { email, password } = request.body;

  try {

    if (lockedUntil && lockedUntil > Date.now()) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] User ${email} telah terkunci hingga 30 menit kemudian` 
      );
    }

    if (lockedUntil && lockedUntil <= Date.now()) {
      attempts = 0;
      lockedUntil = undefined;
      console.log(`[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] 
      User ${email} bisa login kembali karena sudah melewati batas login}`)
    }

    if (attempts >= maxCoba) {
      if (!lockedUntil) {
        lockedUntil = Date.now() + timeOut;
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] User ${email} mencoba login, namun terdapat error 403 karena telah melebihi limit attempt`
        );
      }
    }
    
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Tambahkan upaya login jika gagal
      attempts++;
      // Kembalikan pesan kesalahan jika mencoba login lebih dari 5 kali
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] User ${email} gagal login. Attempt = ${attempts}`
      );
    }

    else {
      // Reset limit jika berhasil login
      attempts = 1;
      lockedUntil = undefined;
    }
    return response.status(200).json(loginSuccess);
  
    } catch (error) {
      return next(error);
    }

  }

module.exports = {
  login,
};
