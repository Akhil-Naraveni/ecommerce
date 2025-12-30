const express = require('express');
const connectDB = require('./connection/connection');
const cors = require('cors');
require('dotenv').config();
require('./database/database'); // Seed database on startup
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : '*',
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
