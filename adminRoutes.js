const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/', adminController.getDashboard);

// Manage products
router.get('/products', adminController.getProducts);
router.post('/products/add', adminController.addProduct);
router.post('/products/update/:id', adminController.updateProduct);
router.post('/products/delete/:id', adminController.deleteProduct);

// Manage customers
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomerOrders);
router.post('/customers/update/:id', adminController.updateCustomer);
router.post('/customers/delete/:id', adminController.deleteCustomer);

module.exports = router;
