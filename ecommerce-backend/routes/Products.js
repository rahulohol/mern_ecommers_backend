// const express = require('express');
// const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
// const { Product } = require('../model/Product');

// const router = express.Router();
// //  /products is already added in base path
// router.post('/', createProduct)
//       .get('/', fetchAllProducts)
//       .get('/:id', fetchProductById)
//       .patch('/:id', updateProduct)


      

// exports.router = router;



const express = require('express');
const { 
  createProduct, 
  fetchAllProducts, 
  fetchProductById, 
  updateProduct,
  searchProducts,
  searchSuggestions,
  getPopularSearches
} = require('../controller/Product');

const router = express.Router();

// /products is already added in base path

// 🔍 SEARCH ROUTES (must come before /:id to avoid conflicts)
router.get('/search', searchProducts);                    // Full search with pagination
router.get('/search/suggestions', searchSuggestions);     // Auto-suggest
router.get('/search/popular', getPopularSearches);        // Popular searches

// STANDARD PRODUCT ROUTES
router.post('/', createProduct);
router.get('/', fetchAllProducts);
router.get('/:id', fetchProductById);
router.patch('/:id', updateProduct);

exports.router = router;