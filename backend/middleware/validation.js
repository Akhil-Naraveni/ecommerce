// Input validation middleware
const validateAddToCart = (req, res, next) => {
    const { productId, quantity } = req.body;

    // Validate productId
    if (!productId) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            error: 'Product ID is required' 
        });
    }

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            error: 'Invalid Product ID format' 
        });
    }

    // Validate quantity
    if (quantity !== undefined) {
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ 
                message: 'Validation Error', 
                error: 'Quantity must be a positive integer' 
            });
        }
        if (quantity > 1000) {
            return res.status(400).json({ 
                message: 'Validation Error', 
                error: 'Quantity cannot exceed 1000' 
            });
        }
    }

    next();
};

const validateUpdateQuantity = (req, res, next) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate itemId
    if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            error: 'Invalid item ID format' 
        });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            error: 'Quantity must be a positive integer' 
        });
    }

    if (quantity > 1000) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            error: 'Quantity cannot exceed 1000' 
        });
    }

    next();
};

const validateDeleteItem = (req, res, next) => {
    const { itemId } = req.params;

    if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            error: 'Invalid item ID format' 
        });
    }

    next();
};

module.exports = {
    validateAddToCart,
    validateUpdateQuantity,
    validateDeleteItem
};
