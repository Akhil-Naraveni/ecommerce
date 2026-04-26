const express = require('express');
const connectDB = require('./connection/connection');
const cors = require('cors');
require('dotenv').config();
require('./database/database'); // Seed database on startup
const errorHandler = require('./middleware/errorHandler');
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration from environment variables
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002').split(',');
const corsOptions = {
  origin: corsOrigins,
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
const authRoutes = require('./routes/auth');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/auth', authRoutes);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
