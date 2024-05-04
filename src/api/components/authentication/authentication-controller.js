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

  const emailnya = await authenticationRepository.getUserByEmail(email);
  const batascoba = 5; // Maximum login attempts allowed
  const penalty = 30 * 60 * 1000; // Block duration in milliseconds (30 minutes)

  let percobaan = {};
  let lastLoginTime = 0;

  try {
    const keblokir = loginAttempt.get(email);
    
    if(keblokir && keblokir.attempts >= batascoba){
      const waktuDini = Date.now();

      if(waktuDini - keblokir.lastAttemptTime  < penalty){
        throw errorResponder(errorTypes.FORBIDDEN);
      }

      else{
        loginAttempt.delete(email);
      }
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

 
    if(!loginSuccess){
      if (attempts <= batascoba) {
        if (loginSuccess) {
          attempts = 0;
          lastLoginTime = Date.now(); 
        }
      
        else {
          attempts ++;
        }
      }

      if (attempts >= batascoba) {
        throw errorResponder(
          errorTypes.AVOID_SPAM
        );
      } 
     
      else {
        attempts = 0;
        return response.status(200).json(loginSuccess);
      }
    }

    attempts = 0;
    lastLoginTime = Date.now(); 
    return response.status(200).json(loginSuccess);

  } 
    catch (error) {
    return next(error);
    }
}
  module.exports = {
    login,
  };

