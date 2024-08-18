const mongoose = require('mongoose');
const Product = require('./models/product');
const credentials = require('./credentials');

const products = [
    { name: 'Shirt 1', description: 'Description of Shirt 1', price: 15.99, image: 'tee1.jpg', sizes: { xs: 10, s: 10, m: 10, l: 10, xl: 10 } },
    { name: 'Shirt 2', description: 'Description of Shirt 2', price: 11.99, image: 'tee2.jpg', sizes: { xs: 10, s: 10, m: 10, l: 10, xl: 10 } },
    { name: 'Shirt 3', description: 'Description of Shirt 3', price: 14.99, image: 'tee3.jpg', sizes: { xs: 10, s: 10, m: 10, l: 10, xl: 10 } },
    { name: 'Shirt 4', description: 'Description of Shirt 4', price: 19.99, image: 'tee4.jpg', sizes: { xs: 10, s: 10, m: 10, l: 10, xl: 10 } },
    { name: 'Shirt 5', description: 'Description of Shirt 5', price: 14.99, image: 'tee5.jpg', sizes: { xs: 10, s: 10, m: 10, l: 10, xl: 10 } },
    { name: 'Shirt 6', description: 'Description of Shirt 6', price: 18.99, image: 'tee6.jpg', sizes: { xs: 10, s: 10, m: 10, l: 10, xl: 10 } }
];

const connectDB = async () => {
    try {
        const dbUrl =`mongodb+srv://${credentials.username}:${credentials.password}@${credentials.host}/${credentials.database}`;
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

const shirtDB = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Products inserted');
    } catch (err) {
        console.error('Error inserting products:', err);
    } finally {
        mongoose.connection.close();
    }
};

connectDB().then(shirtDB);
