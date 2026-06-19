const express = require('express');
const OpenAI = require('openai');
const Product = require('../models/products');

const router = express.Router();

const MAX_MESSAGE_LENGTH = 1000;
const MAX_CATALOG_ITEMS = 60;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

const getProviderConfig = () => {
    const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

    if (provider === 'gemini') {
        return {
            provider,
            apiKey: process.env.GEMINI_API_KEY,
            model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
            baseURL: GEMINI_BASE_URL,
            missingKeyName: 'GEMINI_API_KEY'
        };
    }

    return {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-5.5',
        missingKeyName: 'OPENAI_API_KEY'
    };
};

const sanitizeProduct = (product) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    rating: product.rating
});

const formatCatalog = (products) => products.map((product, index) => {
    const rating = product.rating
        ? `${product.rating.rate}/5 from ${product.rating.count} reviews`
        : 'No rating';

    return [
        `#${index + 1}`,
        `Product ID: ${product._id}`,
        `Name: ${product.name}`,
        `Category: ${product.category}`,
        `Price: $${product.price}`,
        `Rating: ${rating}`,
        `Description: ${product.description || 'No description available'}`
    ].join('\n');
}).join('\n\n');

const getInstructions = () => [
    'You are a helpful AI shopping assistant for this ecommerce app.',
    'Use only the provided product catalog when recommending or comparing products.',
    'If the user asks for an item that is not in the catalog, say that it is not currently available and suggest the closest matching catalog items.',
    'Keep answers concise, practical, and friendly.',
    'Mention product names, prices, categories, and short reasons for recommendations.',
    'Wrap every exact product name in Markdown bold, like **Product Name**.',
    'Do not invent discounts, stock status, policies, shipping details, or product attributes that are not present in the catalog.'
].join(' ');

const getPrompt = (products, message) => [
    'Product catalog:',
    formatCatalog(products),
    '',
    `Customer question: ${message}`
].join('\n');

const createAiResponse = async ({ providerConfig, products, message }) => {
    const client = new OpenAI({
        apiKey: providerConfig.apiKey,
        baseURL: providerConfig.baseURL
    });

    if (providerConfig.provider === 'gemini') {
        const response = await client.chat.completions.create({
            model: providerConfig.model,
            messages: [
                { role: 'system', content: getInstructions() },
                { role: 'user', content: getPrompt(products, message) }
            ]
        });

        return response.choices?.[0]?.message?.content || '';
    }

    const response = await client.responses.create({
        model: providerConfig.model,
        instructions: getInstructions(),
        input: getPrompt(products, message)
    });

    return response.output_text;
};

router.post('/shopping-assistant', async (req, res) => {
    try {
        const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
        const providerConfig = getProviderConfig();

        if (!message) {
            return res.status(400).json({
                message: 'Validation Error',
                error: 'Message is required'
            });
        }

        if (message.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                message: 'Validation Error',
                error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`
            });
        }

        if (!providerConfig.apiKey) {
            return res.status(503).json({
                message: 'AI assistant is not configured',
                error: `${providerConfig.missingKeyName} is missing on the backend server`
            });
        }

        const products = await Product.find()
            .select('name price image description category rating')
            .limit(MAX_CATALOG_ITEMS)
            .lean();

        if (!products.length) {
            return res.status(404).json({
                message: 'No products available',
                error: 'The assistant needs products in the catalog before it can recommend items'
            });
        }

        const reply = await createAiResponse({
            providerConfig,
            products,
            message
        });

        return res.json({
            reply,
            provider: providerConfig.provider,
            model: providerConfig.model,
            productsUsed: products.map(sanitizeProduct)
        });
    } catch (error) {
        console.error('AI assistant error:', error);
        return res.status(500).json({
            message: 'AI assistant failed',
            error: process.env.NODE_ENV === 'production' ? 'Unable to generate a response' : error.message
        });
    }
});

module.exports = router;
