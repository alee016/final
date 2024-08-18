const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Route to view a single product
router.get('/:id', productController.getProductById);

router.post('/add', productController.createProduct);

router.get('/:id', productController.viewProduct);

// Search for products based on query parameters
router.get('/search', productController.searchProducts);

// Filter products based on certain criteria
router.get('/filter', productController.filterProducts);

module.exports = router;