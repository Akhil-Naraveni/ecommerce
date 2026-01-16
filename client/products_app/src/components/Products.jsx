import React,{ useEffect, useState} from "react";
import "./Products.css";
import productIcon from "../../icons/product.svg"
import wishlistSelectedIcon from "../../icons/wishlist_selected.svg"
import wishlistUnselectedIcon from "../../icons/wishlist_not_selected.svg"
import starIcon from "../../icons/star.svg"
const Products = () =>{
    const [productsList, setProductsList] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/v1/products")
            .then((response) => response.json())
            .then((data) => setProductsList(data))
            .catch((error) => console.error("Error fetching products:", error));

    }, []);

    const handleAddToCart = (product) => {
        fetch("http://localhost:5000/api/v1/cart/cartitems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: product._id, quantity: 1 }),
        })
        .then((response) => {
            let addProductEvt = new CustomEvent("productAddedToCart", { detail: product });
            window.dispatchEvent(addProductEvt);
            return response.json()
        })
        .catch((error) => console.error("Error adding to cart:", error));
    };
    const handleWishlist = (product) => {
        if (wishlist.includes(product._id)) {
            setWishlist(prevWishlist => prevWishlist.filter(id => id !== product._id));
        } else {
            setWishlist((prevWishlist) => [...prevWishlist, product._id]);
        }
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
                    <span className="rating"><img src={starIcon} alt="Star Rating" width="14" height="20"/>{product.rating.rate} ({product.rating.count})</span>
                    <img src={product.image} alt={product.name} width="200" height="200"/>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <p className="price">Price: ${product.price}</p>
                    <div className="btn-container">
                        <button className="addtocartbtn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        <button onClick={() => handleWishlist(product)} className="wishlisticon"><img src={wishlist.includes(product._id) ? wishlistSelectedIcon : wishlistUnselectedIcon} alt="Wishlist Icon" width="24" height="30"/></button>
                    </div>
                    
                </div>
            ))}
            </div>
        </div>
    )
}

export default Products;