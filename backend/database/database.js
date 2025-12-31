const NewProduct = require('../models/products');

const sampleData = [
    { id: 1, name: "Product 1", price: 100, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 1" },
    { id: 2, name: "Product 2", price: 200, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 2" },
    { id: 3, name: "Product 3", price: 300, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 3" },
    { id: 4, name: "Product 4", price: 400, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 4" },
    { id: 5, name: "Product 5", price: 500, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 5" },
    { id: 6, name: "Product 6", price: 600, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 6" },
    { id: 7, name: "Product 7", price: 700, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 7" },
    { id: 8, name: "Product 8", price: 800, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 8" },
    { id: 9, name: "Product 9", price: 900, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 9" },
    { id: 10, name: "Product 10", price: 1000, image: "https://pngimg.com/uploads/dress/dress_PNG127.png", description: "Description for Product 10" }
];

const seedDatabase = async () => {
    try {
        await NewProduct.deleteMany({});
        await NewProduct.insertMany(sampleData);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}
seedDatabase();

module.exports = sampleData;