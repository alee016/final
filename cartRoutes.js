const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// View cart
router.get('/', cartController.viewCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Remove item from cart
router.post('/remove', cartController.removeFromCart);

// Checkout
router.post('/checkout', cartController.checkout);

module.exports = router;
