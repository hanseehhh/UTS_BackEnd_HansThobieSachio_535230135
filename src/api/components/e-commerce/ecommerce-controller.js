const ecommerceService = require('./ecommerce-service');
const { errorResponder, errorTypes } = require('../../../core/errors');



/**
 * Mengambil Data Product Dari Service (yang Valid)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function getProducts(request, response, next){
  try {
    //Deklarasi 
    const products = await ecommerceService.getProducts();
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
      const data = await ecommerceService.getProducts();

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
      const data = await ecommerceService.getProducts();         // Pengambilan Data Utuh(Polosan)

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
      const data = await ecommerceService.getProducts();       
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
      hasil.page_size = products.length    
      hasil.count = products.length
      hasil.total_pages = Math.ceil(products.length/products.length)
      hasil.has_previous_page = (iawalan>0)                 
      hasil.has_next_page = (iakhiran<products.length)
      hasil.data = products
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
    const data = await ecommerceService.getProducts();

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
 * Mengambil Product Dengan id Dari Service
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await ecommerceService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown Product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Membuat Product Baru (Bisa Membuat Product Yang Sama lebih dari 1)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const stock = request.body.stock;

    const success = await ecommerceService.createProduct(name, description, price, stock);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create Product'
      );
    }

    return response.status(200).json({ name, description, price, stock, message: 'Product Berhasil Di Buat' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Mengatasi Perubahan Dari Product (Bisa Update Berkali-Kali)
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const description = request.body.description;
    const price = request.body.price;
    const stock = request.body.stock;


    const success = await ecommerceService.updateProduct(id, description, price, stock);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update Product'
      );
    }

    return response.status(200).json({id, description, price, stock, message: 'Product Berhasil Di Perbaharui'});
  } catch (error) {
    return next(error);
  }
}

/**
 * Mengatasi Penghapusan(Delete) Product 
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ecommerceService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete Product'
      );
    }

    return response.status(200).json({ id, message: 'Product Berhasil Di Hapus'});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};