const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            message: 'Authentication Error', 
            error: 'No token provided' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Authentication Error', 
                error: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
