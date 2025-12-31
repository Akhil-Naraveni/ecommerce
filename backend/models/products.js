const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        rate :{
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            required: true,
            min: 0
        }
    }
});

module.exports = mongoose.model('NewProduct', productSchema);
