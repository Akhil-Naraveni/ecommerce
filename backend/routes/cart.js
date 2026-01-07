const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/products');

// Get cart by ID
router.get('/cartitems', async (req, res) =>{
    try{
        const cart =await Cart.findOne().populate('items.productId');
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Filter out items where product doesn't exist
        cart.items = cart.items.filter(item => item.productId !== null);
        
        // Transform productId to product for frontend consistency
        const transformedItems = cart.items.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            product: item.productId
        }));
        
        const totalPrice = transformedItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
        const totalNoOfItems = transformedItems.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
        
        res.json({ cart: { ...cart.toObject(), items: transformedItems }, totalPrice, totalNoOfItems });
    } catch (error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
})

router.post('/cartitems', async (req, res) =>{
    const {productId, quantity = 1} = req.body;
    try{
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart.findOne();
        if(!cart){
            cart = new Cart({ items: [] });
            await cart.save();
        }
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if(existingItem){
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        await cart.save();
        await cart.populate('items.productId');
        res.status(201).json(cart);
    } catch (error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
})

router.put('/cartitems/:itemId', async (req, res) =>{
    const { itemId } = req.params;
    const { quantity } = req.body;
    try{
        const cart = await Cart.findOne();
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        const item = cart.items.id(itemId);
        if(!item){
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        item.quantity = quantity;
        await cart.save();
        // Reload cart after save and populate product details
        const updatedCart = await Cart.findById(cart._id).populate('items.productId');
        // Filter out items where product doesn't exist
        updatedCart.items = updatedCart.items.filter(item => item.productId !== null);
        
        const totalPrice = updatedCart.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
        const totalNoOfItems = updatedCart.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);  
        res.json({ cart: updatedCart, totalPrice, totalNoOfItems });
    } catch (error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
})
router.delete('/cartitems/:itemId', async (req, res) =>{
    const { itemId } = req.params;
    try{
        const cart = await Cart.findOne();
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        const item = cart.items.id(itemId);
        if(!item){
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        cart.items.pull({ _id: itemId });
        await cart.save();
        await cart.populate('items.productId');
        // Filter out items where product doesn't exist
        cart.items = cart.items.filter(item => item.productId !== null);
        const totalPrice = cart.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
        const totalNoOfItems = cart.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
        res.json({ cart, totalPrice, totalNoOfItems });
    } catch (error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
})

router.delete('/cartitems', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        await cart.save();
        await cart.populate('items.productId');
        const totalPrice = cart.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
        const totalNoOfItems = cart.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
        res.json({ cart, totalPrice, totalNoOfItems });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
})

module.exports = router;