const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

// MENGKONVERSI DARI DATE MENJADI SESUAI SOAL
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');

// DEKLARASI VARIABEL (UNTUK MELAKUKAN SYARAT 5X DAN TIMEOUT)
let attempts = 0;
let lockedUntil = undefined;

// Dekrlarasi Maksimal Coba Login 5x dan TimeOut account 30menit
const maxCoba = 5;                                  // 5 Kali Percobaan
const timeOut = 30 * 60 * 1000;                     // 30 menit dalam milidetik

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // KONDISI DIMANA JIKA USER TERUS LOGIN WALAU MASIH TERKENA TIMEOUT
    if (lockedUntil && lockedUntil > Date.now()) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] User ${email} telah terkunci hingga 30 menit kemudian` 
      );
    }

    // KONDISI DIMANA USER SUDAH BISA LOGIN KEMBALI KARENA WAKTU TIMEOUT SUDAH BERAKHIR
    if (lockedUntil && lockedUntil <= Date.now()) {
      attempts = 0;
      lockedUntil = undefined;
      console.log(`[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] 
      User ${email} bisa login kembali karena sudah melewati batas login}`)
    }

    // KONDISI DIMANA KETIKA ATTEMPTS SUDAH MELEBIH BATAS MENCOBA LOGIN
    if (attempts >= maxCoba) {
      if (!lockedUntil) {                       // Kondisi ketika dia belum terkena TimeOut maka akan diberikan 
        lockedUntil = Date.now() + timeOut;     // date saat ini ditambah timeOut(30menit)
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] User ${email} mencoba login, namun terdapat error 403 karena telah melebihi limit attempt`
        );
      }
    }
    
    // MENGECEK CREDENTIALS DARI LOGIN
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // KONDISI DIMANA USER GAGAL LOGIN 
    if (!loginSuccess) {
      
      attempts++;                                                     // Tambahkan upaya login jika gagal
      throw errorResponder(                                           // Kembalikan pesan kesalahan jika mencoba login lebih dari 5 kali
        errorTypes.FORBIDDEN,
        `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] User ${email} gagal login. Attempt = ${attempts}`
      );
    }

    // KONDISI DIMANA USER BERHASIL LOGIN SEBELUM 5x(BATAS LOGIN)
    else {
      // Reset limit jika berhasil login
      attempts = 1;
      lockedUntil = undefined;
    }

    // JIKA DARI AWAL SUCCESS LOGIN LANGSUNG RETURN 
    return response.status(200).json(loginSuccess);
  
  } catch (error) {
    return next(error);
  }

}

module.exports = {
  login,
};
