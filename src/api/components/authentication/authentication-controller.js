const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

let attempts = 1;
let lockedUntil = undefined;

const maxCoba = 5;
const timeOut = 30 * 60 * 1000; // 30 menit dalam milidetik

async function login(request, response, next) {
  const { email, password } = request.body;


  try {

    if (lockedUntil && lockedUntil > Date.now()) {
      throw errorResponder(errorTypes.FORBIDDEN);
    }

    if (lockedUntil && lockedUntil <= Date.now()) {
      attempts = 0;
      lockedUntil = undefined;
    }

    if (attempts >= maxCoba) {
      if (!lockedUntil) {
        lockedUntil = Date.now() + timeOut;
        throw errorResponder(errorTypes.FORBIDDEN);
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
        'Wrong email or password'
      );
    }

    if (attempts >= maxCoba) {
      throw errorResponder(
        errorTypes.AVOID_SPAM
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
