import React,{ useEffect, useMemo, useState} from "react";
import "./Products.css";
import productIcon from "../../icons/product.svg"
import wishlistSelectedIcon from "../../icons/wishlist_selected.svg"
import wishlistUnselectedIcon from "../../icons/wishlist_not_selected.svg"
import starIcon from "../../icons/star.svg"
import loadingIcon from "../../icons/loading.svg"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

const Products = () =>{
    const [productsList, setProductsList] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleSearchChanged = (event) => {
            const detail = event?.detail || {};
            setSearchQuery(detail.query || "");
            setSearchCategory(detail.category || "all");
        };

        window.addEventListener("productsSearchChanged", handleSearchChanged);
        return () => window.removeEventListener("productsSearchChanged", handleSearchChanged);
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProductsList(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Please login to add items to cart');
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/cart/cartitems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let addProductEvt = new CustomEvent("productAddedToCart", { detail: product });
            window.dispatchEvent(addProductEvt);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart");
        }
    };

    const handleWishlist = (product) => {
        if (wishlist.includes(product._id)) {
            setWishlist(prevWishlist => prevWishlist.filter(id => id !== product._id));
        } else {
            setWishlist((prevWishlist) => [...prevWishlist, product._id]);
        }
    };

    const normalizedQuery = (searchQuery || "").trim().toLowerCase();
    const filteredProducts = useMemo(() => {
        return productsList.filter((product) => {
            if (searchCategory && searchCategory !== "all" && product.category !== searchCategory) {
                return false;
            }
            if (!normalizedQuery) return true;
            const haystack = `${product.name || ""} ${product.description || ""} ${product.category || ""}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [productsList, searchCategory, normalizedQuery]);

    return(
        <>
        {loading? (
            <>
            <img src={loadingIcon} alt="Loading" width="80" height="80" className="loadingIcon"/>
            </>
        ):
        error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <p>{error}</p>
                <button onClick={fetchProducts}>Retry</button>
            </div>
        ) :
        (<div className="main">
            <div className="head">
                <h1>Products</h1>
                <img src={productIcon} alt="Product Icon" width="40" height="40"/>
            </div>
            <hr/>
            <div className="productscontainer">
            {filteredProducts.map((product) => (
                <div className="productcard" key={product._id}>
                    <span className="rating"><img src={starIcon} alt="Star Rating" width="14" height="20"/>{product.rating.rate} ({product.rating.count})</span>
                    <img src={product.image} loading="lazy" alt={product.name} width="200" height="200"/>
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
        </div>)}
        </>
    )
}

export default Products;
