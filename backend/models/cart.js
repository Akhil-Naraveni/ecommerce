const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewProduct',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    items : [cartItemSchema],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NewCart', cartSchema);