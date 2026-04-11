const express = require('express');
const connectDB = require('./connection/connection');
const cors = require('cors');
require('dotenv').config();
require('./database/database'); // Seed database on startup
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://ecommerce-cart-yd8q.onrender.com',
    'https://ecommerce-products-0eng.onrender.com',
    'https://ecommerce-hexf.onrender.com/'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();
app.use(express.json());

// Routes
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
