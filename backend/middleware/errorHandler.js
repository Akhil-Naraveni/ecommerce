// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorType = err.name || 'Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        return res.status(statusCode).json({
            message,
            error: err.message,
            type: 'VALIDATION_ERROR'
        });
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        return res.status(statusCode).json({
            message,
            error: 'Invalid ID provided',
            type: 'CAST_ERROR'
        });
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate Entry';
        return res.status(statusCode).json({
            message,
            error: `${Object.keys(err.keyPattern)[0]} already exists`,
            type: 'DUPLICATE_ERROR'
        });
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Authentication Error';
        return res.status(statusCode).json({
            message,
            error: 'Invalid token',
            type: 'JWT_ERROR'
        });
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication Error';
        return res.status(statusCode).json({
            message,
            error: 'Token expired',
            type: 'TOKEN_EXPIRED'
        });
    }

    // Generic error response
    res.status(statusCode).json({
        message,
        error: process.env.NODE_ENV === 'production' ? message : err.message,
        type: errorType
    });
};

module.exports = errorHandler;
