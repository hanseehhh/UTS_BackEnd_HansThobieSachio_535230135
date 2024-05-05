const ecommerceRepository = require('./ecommerce-repository');


/**
 * MENDAPATKAN LIST DARI PRODUCT BERUPA
 * @returns {Array}
 */
async function getProducts() {
  const products = await ecommerceRepository.getProducts();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  }

  return results;
}

/**
 * MENDAPATKAN DETIL DARI PRODUCT (BY ID)
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getProduct(id){
  const product = await ecommerceRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  };
}

/**
 * MEMBUAT PRODUCT BARU
 * @param {string} name - Product Name
 * @param {string} description - Deskripsi
 * @param {string} price - Harga Product
 * @param {string} stock - Stock Product
 * @returns {boolean}
 */
async function createProduct(name, description, price, stock) {

  try {
    await ecommerceRepository.createProduct(name, description, price, stock);

  } 
    catch (err) {
    return null;
    }
  return true;
}

/**
 * MEMPERBAHARUI (UPDATE) PRODUCT YANG SUDAH ADA
 * @param {string} id - Product ID
 * @param {string} name - Product Name
 * @param {string} description - Deskripsi Product
 * @param {string} price - Harga  Product
 * @param {string} stock - Stock  Product
 * @returns {boolean}
 */
async function updateProduct(id, name, description, price, stock) {
  const product = await ecommerceRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await ecommerceRepository.updateProduct(id, name, description, price, stock);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * MENGHAPUS (DELETE) PRODUCT YANG SUDAH ADA
 * @param {string} id - Product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await ecommerceRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await ecommerceRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,

};