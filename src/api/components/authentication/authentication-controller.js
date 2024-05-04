const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    let loginAttempts = 0;
    let lockedUntil = 0;
    const attempt = 5; // Maximum login attempts allowed
    const timeout = 30 * 60 * 1000; // Block duration in milliseconds (30 minutes)
    // Check if the user is blocked due to exceeding the maximum login attempts

    if (lockedUntil && lockedUntil > Date.now()) {
      throw errorResponder(errorTypes.FORBIDDEN);
    }

    if (lockedUntil && lockedUntil <= Date.now()) {
      loginAttempts = 0;
      lockedUntil = undefined;
    }

    // Cek login jika lebih dari 5 kali gagal
    if (loginAttempts >= attempt) {
      if (!lockedUntil) {
        lockedUntil = Date.now() + timeout;
        throw errorResponder(errorTypes.FORBIDDEN)
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );


    if (!loginSuccess) {
      // Tambahkan upaya login jika gagal
      loginAttempts++;
      // Kembalikan pesan kesalahan jika mencoba login lebih dari 5 kali
      if (loginAttempts >= attempt) {
        throw errorResponder(
          errorTypes.AVOID_SPAM
        );
      }
    }
      else {
        // Reset limit jika berhasil login  
        loginAttempts = 0;
        lockedUntil = undefined;
      }
    

    return response.status(200).json(loginSuccess);
  }
    catch (error) {
    throw(error);
    }
}

  
// async function login(request, response, next) {

//   // const { email, password } = request.body;

//   // try {
//     // Check login credentials
//   //   const loginSuccess = await authenticationServices.checkLoginCredentials(
//   //     email,
//   //     password
//   //   );

//   //   if (!loginSuccess) {
//   //     throw errorResponder(
//   //       errorTypes.INVALID_CREDENTIALS,
//   //       'Wrong email or password'
//   //     );
//   //   }

//   //   return response.status(200).json(loginSuccess);
//   // }

//   // const { email, password } = request.body;

//   // const emailnya = await authenticationRepository.getUserByEmail(email);
//   // const batascoba = 5; // Maximum login attempts allowed
//   // const penalty = 30 * 60 * 1000; // Block duration in milliseconds (30 minutes)

//   // let percobaan = 0;
//   // let lastLoginTime = 0;

//   // try {
//   //   const keblokir = loginAttempt.get(email);
    
//   //   if(keblokir && keblokir.attempts >= batascoba){
//   //     const waktuDini = Date.now();

//   //     if(waktuDini - keblokir.lastAttemptTime  < penalty){
//   //       throw errorResponder(errorTypes.FORBIDDEN);
//   //     }

//   //     else{
//   //       loginAttempt.delete(email);
//   //     }
//   //   }

//     // const loginSuccess = await authenticationServices.checkLoginCredentials(
//     //   email,
//     //   password
//     // );

 
//     // if (!loginSuccess) {
//     //   // Untuk menambahkan attempts
//     //   if () { 

//     //    } 
// 	  //   else {
//     //     attempts++;
//     //   }

      

//     //   if (attempts >= batascoba) {
//     //     loginAttempt.set(email, { attempts, lastAttemptTime });
//     //     throw errorResponder(
//     //       errorTypes.AVOID_SPAM
//     //     );
//     //   } 
     
//     //   else {
//     //     attempts = 0;
//     //     return response.status(401).json({ error: "Invalid email or password. Please try again." });
//     //   }
    
//     // }

//   // attempts = 0;
//   // lastLoginTime = Date.now(); 
//   // return response.status(200).json(loginSuccess);
  

//   // }
 
//     catch (error) {
//     return next(error);
//     }
// }
  module.exports = {
    login,
  };

