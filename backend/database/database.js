const NewProduct = require('../models/products');

const sampleData = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 299,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D",
    description: "Comfortable and breathable 100% cotton t-shirt perfect for everyday wear",
    category: "Clothing",
    rating: { rate: 4.5, count: 120 }
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 1299,
    image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGplYW5zfGVufDB8fDB8fHww",
    description: "Premium denim jeans with perfect fit and durability",
    category: "Clothing",
    rating: { rate: 4.7, count: 259 }
  },
  {
    id: 3,
    name: "Casual Summer Dress",
    price: 899,
    image: "https://images.unsplash.com/photo-1762154057377-cc9d3dd6900c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FzdWFsJTIwc3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
    description: "Light and airy summer dress ideal for warm weather",
    category: "Clothing",
    rating: { rate: 4.3, count: 89 }
  },
  {
    id: 4,
    name: "Leather Jacket",
    price: 3499,
    image: "https://images.unsplash.com/photo-1727524366429-27de8607d5f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fExlYXRoZXIlMjBKYWNrZXR8ZW58MHx8MHx8fDA%3D",
    description: "Stylish and durable black leather jacket for all seasons",
    category: "Clothing",
    rating: { rate: 4.8, count: 500 }
  },
  {
    id: 5,
    name: "Wool Sweater",
    price: 1599,
    image: "https://plus.unsplash.com/premium_photo-1673458070037-8cc98a465c0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V29vbCUyMFN3ZWF0ZXJ8ZW58MHx8MHx8fDA%3D",
    description: "Warm and cozy wool sweater perfect for winter",
    category: "Clothing",
    rating: { rate: 4.6, count: 234 }
  },
  {
    id: 6,
    name: "Athletic Shorts",
    price: 599,
    image: "https://plus.unsplash.com/premium_photo-1664299205746-725a067e55ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QXRobGV0aWMlMjBTaG9ydHN8ZW58MHx8MHx8fDA%3D",
    description: "Breathable athletic shorts with moisture-wicking technology",
    category: "Sportswear",
    rating: { rate: 4.4, count: 156 }
  },
  {
    id: 7,
    name: "Formal Blazer",
    price: 2499,
    image: "https://plus.unsplash.com/premium_photo-1676389764673-e2786bffd449?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Rm9ybWFsJTIwQmxhemVyfGVufDB8fDB8fHww",
    description: "Professional formal blazer for business occasions",
    category: "Clothing",
    rating: { rate: 4.9, count: 345 }
  },
  {
    id: 8,
    name: "Yoga Leggings",
    price: 1199,
    image: "https://images.unsplash.com/photo-1626026397008-3316047db4fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8WW9nYSUyMExlZ2dpbmdzfGVufDB8fDB8fHww",
    description: "Comfortable yoga leggings with excellent flexibility",
    category: "Sportswear",
    rating: { rate: 4.7, count: 456 }
  },
  {
    id: 9,
    name: "Cargo Pants",
    price: 1399,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyZ28lMjBwYW50c3xlbnwwfHwwfHx8MA%3D%3D",
    description: "Practical cargo pants with multiple pockets",
    category: "Clothing",
    rating: { rate: 4.2, count: 78 }
  },
  {
    id: 10,
    name: "Running Shoes",
    price: 4999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UnVubmluZyUyMFNob2VzfGVufDB8fDB8fHww",
    description: "Professional running shoes with cushioned sole and excellent grip",
    category: "Footwear",
    rating: { rate: 4.8, count: 890 }
  },
  {
    id: 11,
    name: "Oversized Hoodie",
    price: 1699,
    image: "https://media.istockphoto.com/id/1293292206/photo/young-beautiful-girl-in-a-white-hoodie-posing-warm-oversized-hoodie-with-an-hood-stylish.webp?a=1&b=1&s=612x612&w=0&k=20&c=AyptsSWZPenmjbLZjDVrckXcr50Yqx2ZAW3SDi3drGg=",
    description: "Soft oversized hoodie with a relaxed fit for everyday comfort",
    category: "Clothing",
    rating: { rate: 4.6, count: 412 }
  },
  {
    id: 12,
    name: "Minimal Sneakers",
    price: 2899,
    image: "https://images.unsplash.com/photo-1573875133340-0b589f59a8c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TWluaW1hbCUyMFNuZWFrZXJzfGVufDB8fDB8fHww",
    description: "Clean low-top sneakers that pair with everything",
    category: "Footwear",
    rating: { rate: 4.5, count: 680 }
  },
  {
    id: 13,
    name: "Athleisure Track Jacket",
    price: 2199,
    image: "https://media.istockphoto.com/id/1183553994/photo/childrens-fleece-jacket.webp?a=1&b=1&s=612x612&w=0&k=20&c=CEtEmFNAXWjQfjan-EGiCfop5hiRnQiX3B7yahcURiQ=",
    description: "Lightweight zip-up track jacket for gym and streetwear",
    category: "Sportswear",
    rating: { rate: 4.4, count: 275 }
  },
  {
    id: 14,
    name: "Cargo Joggers",
    price: 1499,
    image: "https://media.istockphoto.com/id/695659676/photo/two-people-race-together-riding-rollerblades.jpg?s=612x612&w=0&k=20&c=Ri7p2VukcDzsK2imbKwdL6h7sso3XC8RLIvRDIZRMQM=",
    description: "Tapered cargo joggers with stretch waistband and utility pockets",
    category: "Clothing",
    rating: { rate: 4.3, count: 198 }
  },
  {
    id: 15,
    name: "Training Tank Top",
    price: 499,
    image: "https://images.unsplash.com/photo-1776533874754-cd796b46ff82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VHJhaW5pbmclMjBUYW5rJTIwVG9wfGVufDB8fDB8fHww",
    description: "Breathable training tank with quick-dry fabric",
    category: "Sportswear",
    rating: { rate: 4.2, count: 154 }
  },
  {
    id: 16,
    name: "Canvas Tote Bag",
    price: 699,
    image: "https://plus.unsplash.com/premium_photo-1681415081017-2d7cbc1592c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q2FudmFzJTIwVG90ZSUyMEJhZ3xlbnwwfHwwfHx8MA%3D%3D",
    description: "Durable canvas tote bag for daily carry",
    category: "Clothing",
    rating: { rate: 4.1, count: 92 }
  },
  {
    id: 17,
    name: "Slip-On Loafers",
    price: 3299,
    image: "https://images.unsplash.com/photo-1678784973073-f6a227408e81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fFNsaXAtT24lMjBMb2FmZXJzfGVufDB8fDB8fHww",
    description: "Smart slip-on loafers for casual and semi-formal outfits",
    category: "Footwear",
    rating: { rate: 4.4, count: 141 }
  },
  {
    id: 18,
    name: "High-Waist Shorts",
    price: 899,
    image: "https://plus.unsplash.com/premium_photo-1689575249309-79f1308d6180?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8SGlnaC1XYWlzdCUyMFNob3J0c3xlbnwwfHwwfHx8MA%3D%3D",
    description: "High-waist shorts with a flattering fit for summer days",
    category: "Clothing",
    rating: { rate: 4.3, count: 233 }
  },
  {
    id: 19,
    name: "Compression Tights",
    price: 1299,
    image: "https://images.unsplash.com/photo-1610360414307-4264b6649236?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q29tcHJlc3Npb24lMjBUaWdodHN8ZW58MHx8MHx8fDA%3D",
    description: "Compression tights built for training, recovery, and movement",
    category: "Sportswear",
    rating: { rate: 4.6, count: 501 }
  },
  {
    id: 20,
    name: "Chunky Sole Sneakers",
    price: 3599,
    image: "https://images.unsplash.com/photo-1657194001988-9cbdbc59f115?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fENodW5reSUyMFNvbGUlMjBTbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D",
    description: "Trend-forward sneakers with a chunky sole and all-day comfort",
    category: "Footwear",
    rating: { rate: 4.7, count: 742 }
  }
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
