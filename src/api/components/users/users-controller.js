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
    const users = await usersService.getUsers();
    const masukquery = request.query.search;
    const doSort = request.query.sort;
    //const paginate = await paginatedData(request, response, next);

    const iawalan = {}
    const iakhiran = {}
    const hasil={}


    if(masukquery && doSort){     
      const masukquery = request.query.search;
      const data = await usersService.getUsers();

      const [penamaan, isinya] = masukquery.split(':');
      const hasilCarian = data.filter( find => {
        const Judulnya = find[penamaan];      
        const Isinya = isinya;        
        return Judulnya.includes(Isinya);
      });

      const doSort = request.query.sort;
      const [nama, isi] = doSort.split(':');
      const nilai = hasilCarian.sort((atasnya, bawahnya) => {

        if (isi === 'desc'){
          if (atasnya[nama] > bawahnya[nama]){
            return -1;
          }

          else{
            return 0;
          }
        }

        else if (isi == 'asc'){
          if (atasnya[nama] < bawahnya[nama]){
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
    hasil.page_number = 1 
    hasil.page_size = nilai.length    
    hasil.count = nilai.length
    hasil.total_pages = Math.ceil(nilai.length/nilai.length)
    hasil.has_previous_page = (iawalan>0)                 
    hasil.has_next_page = (iakhiran<nilai.length)
    hasil.data = nilai
    return response.status(200).json(hasil);
    }

                                
    if(masukquery){     
      const data = await usersService.getUsers();

      const [penamaan, isinya] = masukquery.split(':');
      const hasilPencarian = data.filter ( find => {
        const Judulnya = find[penamaan];      
        const Isinya = isinya;        
      
        return Judulnya.includes(Isinya);
      });

      hasil.page_number = 1 
      hasil.page_size = hasilPencarian.length    
      hasil.count = hasilPencarian.length
      hasil.total_pages = Math.ceil(hasilPencarian.length/hasilPencarian.length)
      hasil.has_previous_page = (iawalan>0)                 
      hasil.has_next_page = (iakhiran<hasilPencarian.length)
      hasil.data = hasilPencarian
      return response.status(200).json(hasil)
    }


    if(doSort){
      const data = await usersService.getUsers();
      const [penamaan, nilai] = doSort.split(':');
      const final = data.sort((atasnya, bawahnya) => {

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

    hasil.page_number = 1 
    hasil.page_size = final.length    
    hasil.count = final.length
    hasil.total_pages = Math.ceil(final.length/final.length)
    hasil.has_previous_page = (iawalan>0)                 
    hasil.has_next_page = (iakhiran<final.length)
    hasil.data = final
    return response.status(200).json(hasil);
    }

    else{
      const paginate = await paginatedData (request, response, next);
      return response.status(200).json(paginate);
    }
}
    catch (error) {
    return next(error); 
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
      hasil.page_number = 1 
      hasil.page_size = data.length    
      hasil.count = data.length
      hasil.total_pages = Math.ceil(data.length/data.length)
      hasil.has_previous_page = (iawalan>0)                 
      hasil.has_next_page = (iakhiran<data.length)
      hasil.data = data
      return hasil
    }
    
    // menampilkan additional pada pagination untuk 
    hasil.page_number = halaman  // halaman saat ini
    hasil.page_size = batasan    // banyaknya data pada setiap halaman
    hasil.count = data.length    // menghitung banyaknya data
    hasil.total_pages = Math.ceil(data.length/batasan)    // menampilkan total halaman yang ada
    hasil.has_previous_page = (iawalan>0)                 // boolean kondisi apakah ada page sebelumnya/tidak
    hasil.has_next_page = (iakhiran<data.length)          // boolean kondisi apakah ada page setelahnya/tidak
    hasil.data = data            // membagi data sesuai dengan yang diminta

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
