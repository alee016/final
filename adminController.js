const Product = require('../models/product');
const Customer = require('../models/customer');
const Order = require('../models/order');

// Admin dashboard
exports.getDashboard = (req, res) => {
    res.render('admin-dashboard');
};

// Manage products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin-products', { products });
    } catch (err) {
        console.error('Error fetching products for admin:', err);
        res.status(500).send('Server Error');
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, image, sizes } = req.body;
        const newProduct = new Product({ name, description, price, image, sizes });
        await newProduct.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await Product.findByIdAndUpdate(id, updateData);
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Server Error');
    }
};

// Manage customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.render('admin-customers', { customers });
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error');
    }
};

exports.getCustomerOrders = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate('orders').exec();
        res.render('customer-orders', { customer });
    } catch (err) {
        console.error('Error fetching customer orders:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await Customer.findByIdAndUpdate(id, updateData);
        res.redirect('/admin/customers');
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).send('Server Error');
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await Customer.findByIdAndDelete(id);
        res.redirect('/admin/customers');
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).send('Server Error');
    }
};
