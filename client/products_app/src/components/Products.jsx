import React,{ useEffect, useState} from "react";
import "./Products.css";
import productIcon from "../../icons/product.svg"
const Products = () =>{
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/v1/products")
            .then((response) => response.json())
            .then((data) => setProductsList(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const handleAddToCart = () => {
        alert("Added to cart!");
    };
    return(
        <div className="main">
            <div className="head">
                <h1>Products</h1>
                <img src={productIcon} alt="Product Icon" width="40" height="40"/>
            </div>
            <hr/>
            <div className="productscontainer">
            {productsList.map((product) => (
                <div className="productcard" key={product._id}>
                    <img src={product.image} alt={product.name} width="200" height="200"/>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <p className="price">Price: ${product.price}</p>
                    <button onClick={handleAddToCart}>Add to Cart</button>
                </div>
            ))}
            </div>
        </div>
    )
}

export default Products;