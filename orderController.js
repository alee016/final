const Order = require('../models/order');

const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body; 
        const newOrder = new Order({
            userId,
            items,
            totalAmount
        });

        await newOrder.save();
        console.log(newOrder._id);  
        res.status(201).json({ orderId: newOrder._id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createOrder
};
