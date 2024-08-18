const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

// View cart
exports.viewCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.session.userId }).populate('product').exec();
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.render('cart', { cartItems, totalAmount });
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).send('Server Error');
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product || product.sizes[size] < quantity) {
            return res.status(400).send('Invalid product or quantity');
        }

        let cartItem = await Cart.findOne({ userId: req.session.userId, productId, size });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity, 10);
        } else {
            cartItem = new Cart({
                userId: req.session.userId,
                productId,
                size,
                quantity: parseInt(quantity, 10),
                price: product.price
            });
        }

        await cartItem.save();
        await Product.findByIdAndUpdate(productId, {
            [`sizes.${size}`]: product.sizes[size] - quantity
        });

        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).send('Server Error');
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const cartItem = await Cart.findById(itemId);

        if (cartItem) {
            const product = await Product.findById(cartItem.productId);

            // Restore the quantity to the product
            await Product.findByIdAndUpdate(cartItem.productId, {
                [`sizes.${cartItem.size}`]: product.sizes[cartItem.size] + cartItem.quantity
            });

            await Cart.findByIdAndDelete(itemId);
        }

        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).send('Server Error');
    }
};

// Checkout
exports.checkout = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.session.userId }).populate('product').exec();

        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.price
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create new order
        const newOrder = new Order({
            customerId: req.session.userId,
            items: orderItems,
            total: totalAmount
        });

        await newOrder.save();

        // Clear the cart
        await Cart.deleteMany({ userId: req.session.userId });

        res.render('order-confirmation', { order: newOrder });
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).send('Server Error');
    }
};
