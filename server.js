const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const credentials = require('./credentials');
const Product = require('./models/product');
const Cart = require('./models/cart');
const Order = require('./models/order');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Customer = require('./models/customer');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));



// Set up Handlebars engine
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  handlebars: allowInsecurePrototypeAccess(require('handlebars'))
}));


// Connect to MongoDB
mongoose.connect(`mongodb+srv://${credentials.username}:${credentials.password}@${credentials.host}/${credentials.database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Define routes
app.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('home', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    console.log(product);  
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('product', { product });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Server Error');
  }
});

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(3000, function () {
  console.log('http://localhost:3000');
});
