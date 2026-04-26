const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId, email: '' },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Validation Error',
                error: 'Name, email, and password are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Validation Error',
                error: 'Passwords do not match'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'Validation Error',
                error: 'Email already registered'
            });
        }

        // Create new user
        user = new User({ name, email, password });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Validation Error',
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Authentication Error',
                error: 'Invalid email or password'
            });
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Authentication Error',
                error: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

// Logout route (for frontend to clear token)
router.post('/logout', (req, res) => {
    // Token invalidation is typically handled on the frontend
    res.json({ message: 'Logout successful' });
});

module.exports = router;
