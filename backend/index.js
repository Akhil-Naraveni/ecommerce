const express = require('express');
const connectDB = require('./connection/connection');
const cors = require('cors');
require('dotenv').config();
require('./database/database'); // Seed database on startup
const errorHandler = require('./middleware/errorHandler');
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration from environment variables
// Set `CORS_ORIGINS` to a comma-separated list of allowed frontend origins, e.g.:
// https://your-host.onrender.com,https://your-products.onrender.com
const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001,http://localhost:3002,https://ecommerce-cart-yd8q.onrender.com,https://ecommerce-products-0eng.onrender.com,https://akhil-ecommerce.onrender.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowAllOrigins = corsOrigins.includes("*");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin header) like curl/postman
    if (!origin) return callback(null, true);
    if (allowAllOrigins) return callback(null, true);
    if (corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
