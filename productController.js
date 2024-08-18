const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    const { id, name, description, price, image, sizes } = req.body;

    // Validate the input
    if (!id || !name || !description || !price || !image || !sizes) {
        return res.status(400).send('All fields are required');
    }

    try {
        const product = new Product({
            id: parseInt(id),  // Convert ID to a number
            name,
            description,
            price,
            image,
            sizes
        });

        await product.save();
        res.status(201).send('Product created successfully');
    } catch (err) {
        res.status(500).send('Error creating product');
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('product', { product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Server Error');
    }
};



// Search products
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        const products = await Product.find({ name: new RegExp(query, 'i') });
        res.render('home', { products });
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).send('Server Error');
    }
};

// Filter products
exports.filterProducts = async (req, res) => {
    // Implement filtering logic here based on query parameters
    try {
        const filters = {}; // Example: { category: 't-shirt' }
        const products = await Product.find(filters);
        res.render('home', { products });
    } catch (err) {
        console.error('Error filtering products:', err);
        res.status(500).send('Server Error');
    }
};

exports.viewProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        console.log(product);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('product', { product });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Server Error');
    }
};