const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { filter } = require('lodash');


/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    // melakukan deklarasi
    const masukquery = request.query.search;
    const doSort = request.query.sort;
    let data;

    if(masukquery){ // kondisi dimana ketika terdapat parameter yang dimasukkan untuk dicari maka
      // dilakukan pemanggilan fungsi filtering 
      data = await mencaridata(request, response);
    }

    if(doSort){
      data = await doSorting(request, response)
    }

    else{ 
      // ketika tidak ada pemanggilan fungsi filtering dan sorting maka
      // dilakukan pemanngilan pagination untuk memunculkan data page
      data = await paginatedData(request, response, next);
    }

    return response.status(200).json(data); // output
  } 
    catch (error) {
    return next(error); 
  }
}


/**
 *  Handle filtering (mencaridata) detail request
 * @param {Object} filter
 * @returns {Object}
 */

// FUNCTION UNTUK MELAKUKAN SEARCH/FILTER PADA DATA
async function mencaridata(request, response){
  try{
    // melakukan deklarasi dan mengambil data yang dibutuhkan
    const masukquery = request.query.search;
    const data = await usersService.getUsers();

    const [penamaan, isinya] = masukquery.split(':');    // melakukan split untuk metode "penamaan":"nilai"
    const hasilPencarian = data.filter ( find => {         // filtering

      const Judulnya = find[penamaan];      
      const Isinya = isinya;               

    return Judulnya.includes(Isinya); // pembentukan untuk mencari data
    });
    return response.status(200).json(hasilPencarian); // output
  }
    catch (err) {
    return null;
  }
}


/**
 * Handle sorting of users request 
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @returns {object} Response object or pass an error to the next route
 */

async function doSorting (request, response){
  try{

    const data = await usersService.getUsers();
    const doSort = request.query.sort;
    
    const [penamaan, nilai] = doSort.split(':');
    const hasil = data.sort((atasnya, bawahnya) => {

      if (nilai === 'desc'){
        if (atasnya[penamaan] > bawahnya[penamaan]){
          return -1;
        }

        else{
          return 0;
        }
      }

      else if (nilai == 'asc'){
        if (atasnya[penamaan] < bawahnya[penamaan]){
          return -1;
        }
        
        else{
          return 0;
        }
      }

      else{
        return next(error);
      } 
  });
     
    return response.status(200).json(hasil);
    }  
      catch (err) {
      return null;
  }
}


/**
 * Handle pagination of users request (paginatedData)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

// FUNCTION UNTUK MEMBUAT PAGE PADA DATA YANG TERTERA
async function paginatedData (request, response, next){
  try{
    // mengambil data
    const data = await usersService.getUsers();

    const halaman = parseInt(request.query.page_number)
    const batasan = parseInt(request.query.page_size)

    // iawalan dan iakhiran berupa INDEX 
    const iawalan = (halaman -1) * batasan
    const iakhiran = halaman * batasan

    // hanya melakukan deklarasi
    const hasil = {}


    if (halaman == 0 || batasan == 0){
      return data
    }
    
    // menampilkan additional pada pagination untuk 
    hasil.page_number = halaman  // halaman saat ini
    hasil.page_size = batasan    // banyaknya data pada setiap halaman
    hasil.count = data.length    // menghitung banyaknya data
    hasil.total_pages = Math.ceil(data.length/batasan)    // menampilkan total halaman yang ada
    hasil.has_previous_page = (iawalan>0)                 // boolean kondisi apakah ada page sebelumnya/tidak
    hasil.has_next_page = (iakhiran<data.length)          // boolean kondisi apakah ada page setelahnya/tidak
    hasil.data = data.slice(iawalan,iakhiran)             // membagi data sesuai dengan yang diminta

    return response.status(200).json(hasil); // output

  } catch (error) {
    return next(error); 
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

/**
 * FUNGSI BARU MENGATASI PAGINATION
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
