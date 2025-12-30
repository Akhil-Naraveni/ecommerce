import React, { useState } from 'react';
import './app.css';

const Products = () => {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
    { id: 2, name: 'Phone', price: 699.99, description: 'Latest smartphone' },
    { id: 3, name: 'Tablet', price: 499.99, description: 'Portable tablet device' },
    { id: 4, name: 'Headphones', price: 199.99, description: 'Wireless headphones' },
    { id: 5, name: 'Smart Watch', price: 299.99, description: 'Feature-rich smartwatch' },
    { id: 6, name: 'Camera', price: 799.99, description: 'Digital camera' },
  ]);

  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-container">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <div className="placeholder">Image</div>
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <button
                className="btn-add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
