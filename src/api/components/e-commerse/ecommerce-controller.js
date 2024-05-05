const usersService = require('./ecommerce-service');
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
    //Deklarasi 
    const users = await usersService.getUsers();
    const masukquery = request.query.search;
    const doSort = request.query.sort;

    // Deklarasi untuk penggunaan URL (Dipakai untuk mempermudah melakukan if & else)
    const halaman = parseInt(request.query.page_number)
    const batasan = parseInt(request.query.page_size)

    // Index
    const iawalan = (halaman -1) * batasan
    const iakhiran = halaman * batasan
    const hasil={}


    //Kondisi Ketika Terdapat URL yang Search dan Sort Bersamaan + Penggunaan Page
    if(masukquery && doSort){     
      const masukquery = request.query.search;             // URL Dengan "SEARCH"
      const data = await usersService.getUsers();

      const [penamaan, isinya] = masukquery.split(':');    // Melakukan pemisahan dari bentuk email:test; menjadi email(penamaan) dan test(isinya)
      const hasilCarian = data.filter( find => {           // Melakukan pencarian data sesuai yang diminta
        const Judulnya = find[penamaan];      
        const Isinya = isinya;        
        return Judulnya.includes(Isinya);
      });

      const doSort = request.query.sort;                   // URL Dengan "SORT"   
      const [nama, isi] = doSort.split(':');               // Melakukan pemisahan dari bentuk email:test; menjadi email(nama) dan test(isi)
      const nilai = hasilCarian.sort((atasnya, bawahnya) => {

        if (isi === 'desc'){                              // Dikarenakan untuk melakukan sorting menggunakan STRINGS(input)
          if (atasnya[nama] > bawahnya[nama]){            // Jika ATAS lebih besar daripada BAWAH terjadi perputaran
            return -1;                                    // desc = descending; mengurutkan yang lebih besar terlebih dahulu
          }

          else{ 
            return 0;                                     // jika kondisi sudah sesuai tidak perlu melakukan perputaran
          }
        }

        else if (isi == 'asc'){                           // Dikarenakan untuk melakukan sorting menggunakan STRINGS(input)
          if (atasnya[nama] < bawahnya[nama]){            // Jika ATAS lebih kecil daripada BAWAH terjadi perputaran
            return -1;                                    // asc = ascending; mengurutkan yang lebih kecil terlebih dahulu
          }

          else{
            return 0;
          }
        }

        else{                                             // Ketika penamaan tidak sesuai (asc atau desc) maka SORTING tidak terjadi
          return next(error);                             
        } 

      
    });

    if(halaman && batasan){
      // Memberikan detil paginati
    hasil.page_number = halaman                   
    hasil.page_size = batasan    
    hasil.count = nilai.length
    hasil.total_pages = Math.ceil(nilai.length/batasan)   // Math.ceil untuk pembulatan(ke atas) menjadi angka integer
    hasil.has_previous_page = (iawalan>0)                 // Boolean
    hasil.has_next_page = (iakhiran<nilai.length)         // Boolean
    hasil.data = nilai.slice(iawalan, iakhiran)           // Slice untuk membagi data menjadi halaman
    return response.status(200).json(hasil);    
    }

    else{
      // Memberikan detil paginati
    hasil.page_number = halaman                   
    hasil.page_size = batasan    
    hasil.count = nilai.length
    hasil.total_pages = Math.ceil(nilai.length/batasan)   // Math.ceil untuk pembulatan(ke atas) menjadi angka integer
    hasil.has_previous_page = (iawalan>0)                 // Boolean
    hasil.has_next_page = (iakhiran<nilai.length)         // Boolean
    hasil.data = nilai
    return response.status(200).json(hasil);    
    }
             
    }

    // Kondisi ketika ingin mencari data saja dari keseluruhan data                            
    if(masukquery){     
      const data = await usersService.getUsers();         // Pengambilan Data Utuh(Polosan)

      const [penamaan, isinya] = masukquery.split(':');   // Melakukan pemisahan dari bentuk email:test; menjadi email(penamaan) dan test(isinya)
      const hasilPencarian = data.filter ( find => {      // Melakukan pencarian data sesuai yang diminta
        const Judulnya = find[penamaan];      
        const Isinya = isinya;        
      
        return Judulnya.includes(Isinya);
      });
      // Saya melakukan kondisi jika searching digabung pagination tidak memberikan fitur halaman
      // Sehingga data tetap melakukan searching(filtering) namun hanya berada di 1 page (seperti default users)

      hasil.page_number = 1                               // Di-declare otomatis 1 dikarenakan hanya dimunculkan di 1 page
      hasil.page_size = hasilPencarian.length             // Batasan menjadi sama seperti ukuran dari banyaknya data (tidak ada batasan di 1 halaman)
      hasil.count = hasilPencarian.length
      hasil.total_pages = Math.ceil(hasilPencarian.length/hasilPencarian.length)  // Math.ceil untuk pembulatan(ke atas) menjadi angka integer
      hasil.has_previous_page = (iawalan>0)                                       // Boolean
      hasil.has_next_page = (iakhiran<hasilPencarian.length)                      // Boolean
      hasil.data = hasilPencarian                                                 // Tidak melakukan slice karena tidak ada paginate
      return response.status(200).json(hasil)
    }


    // Kondisi ketika ingin mensorting saja dari keseluruhan data
    if(doSort){
      const data = await usersService.getUsers();       
      const [penamaan, nilai] = doSort.split(':');        // Melakukan pemisahan dari bentuk email:test; menjadi email(nama) dan test(isi)
      const final = data.sort((atasnya, bawahnya) => {

        if (nilai === 'desc'){                            // Dikarenakan untuk melakukan sorting menggunakan STRINGS(input)
          if (atasnya[penamaan] > bawahnya[penamaan]){    // Jika ATAS lebih kecil daripada BAWAH terjadi perputaran
            return -1;                                    // desc = descending; mengurutkan yang lebih besar terlebih dahulu
          }

          else{
            return 0;                                     // jika kondisi sudah sesuai tidak perlu melakukan perputaran
          }
        }

        else if (nilai == 'asc'){                         // Dikarenakan untuk melakukan sorting menggunakan STRINGS(input)
          if (atasnya[penamaan] < bawahnya[penamaan]){    // Jika ATAS lebih kecil daripada BAWAH terjadi perputaran   
            return -1;                                    // asc = ascending; mengurutkan yang lebih kecil terlebih dahulu
          }

          else{
            return 0;                                     // jika kondisi sudah sesuai tidak perlu melakukan perputaran
          }
        }

        else{
          return next(error);
        } 
    });
    // Saya melakukan kondisi jika sorting digabung pagination tidak memberikan fitur halaman
    // Sehingga data tetap melakukan sorting(pengurutan) namun hanya berada di 1 page (seperti default users)

    hasil.page_number = 1                                     // Di-declare otomatis 1 dikarenakan hanya dimunculkan di 1 page
    hasil.page_size = final.length                            // Batasan menjadi sama seperti ukuran dari banyaknya data (tidak ada batasan di 1 halaman)
    hasil.count = final.length                                
    hasil.total_pages = Math.ceil(final.length/final.length)  // Math.ceil untuk pembulatan(ke atas) menjadi angka integer
    hasil.has_previous_page = (iawalan>0)                     // Boolean
    hasil.has_next_page = (iakhiran<final.length)             // Boolean
    hasil.data = final                                        // Tidak melakukan slice karena tidak ada paginate
    return response.status(200).json(hasil);
    }


    // Kondisi hanya untuk menampilkan PAGINATION tanpa melakukan searching dan sorting (harus halaman dan batasan)
    else if(halaman&&batasan){                                               // halaman dan batasan adalah query page_size dan page_number
      const paginate = await paginatedData (request, response, next);        // melakukan pemanggilan fungsi (fungsi di bawah ini )
      return response.status(200).json(paginate);
    }

    // Kondisi untuk melakukan pemanggilan user default (GET /users)
    else{
      hasil.page_number = 1 
      hasil.page_size = users.length    
      hasil.count = users.length
      hasil.total_pages = Math.ceil(users.length/users.length)
      hasil.has_previous_page = (iawalan>0)                 
      hasil.has_next_page = (iakhiran<users.length)
      hasil.data = users
      return response.status(200).json(hasil);
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
    // Mengambil keseluruhan data users
    const data = await usersService.getUsers();

    const halaman = parseInt(request.query.page_number)           // query untuk di URL berupa page_number
    const batasan = parseInt(request.query.page_size)             // query untuk di URL berupa page_number

    // iawalan dan iakhiran berupa INDEX 
    const iawalan = (halaman -1) * batasan
    const iakhiran = halaman * batasan

    // hanya melakukan deklarasi
    const hasil = {}


    if (halaman == 0 || batasan == 0){                            // Kondisi ketika halaman ataupun batasan di-input dengan 0
      hasil.page_number = 1 
      hasil.page_size = data.length    
      hasil.count = data.length
      hasil.total_pages = Math.ceil(data.length/data.length)
      hasil.has_previous_page = (iawalan>0)                 
      hasil.has_next_page = (iakhiran<data.length)
      hasil.data = data
      return response.status(200).json(hasil);
    }
    
    else{                                                         // Kondisi ketika halaman ataupun batasan di-input dengan sesuai (selain 0) 
      hasil.page_number = halaman  
      hasil.page_size = batasan    
      hasil.count = data.length    
      hasil.total_pages = Math.ceil(data.length/batasan)   
      hasil.has_previous_page = (iawalan>0)                 
      hasil.has_next_page = (iakhiran<data.length)          
      hasil.data = data.slice(iawalan,iakhiran)
      return response.status(200).json(hasil); // outpu
    }
   t

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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
