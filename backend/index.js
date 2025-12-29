const express = require('express');
const connectDB = require('./connection/connection');
require('./database/database'); // Seed database on startup
const app = express();
const PORT = process.env.PORT || 5000;

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
