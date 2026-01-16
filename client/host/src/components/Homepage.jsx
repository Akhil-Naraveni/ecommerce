import React, {useState} from "react";
import { Suspense } from "react";
import "./Homepage.css";
const ProductApp = React.lazy(() => import("products_app/Products"));
const CartApp = React.lazy(() => import("cart_app/Cart"));

const Homepage = () => {
    const [activeTab, setActiveTab] = useState("home");
    const [cartItemCount, setCartItemCount] = useState(0);

    const handleCartUpdated = (event) => {
        if (event.detail && event.detail.cartItems) {
            setCartItemCount(event.detail.cartItems.length);
        }
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return (
        <>
            <header>
                <nav>
                    <ul className="navItemCtr">
                        <button onClick={() => setActiveTab("home")} className="logoBtn">E-Commerce</button>
                        <button onClick={() => setActiveTab("home")} className={`navBtn nav-home ${activeTab === "home" ? "selected" : ""}`}>Home</button>
                        <button onClick={() => setActiveTab("products")} className={`navBtn nav-products ${activeTab === "products" ? "selected" : ""}`}>Products</button>
                        <button onClick={() => setActiveTab("cart")} className={`navBtn nav-cart ${activeTab === "cart" ? "selected" : ""}`}>Cart
                            {true && (
                                <span className="badge">{cartItemCount}</span>)}
                        </button>
                        <button onClick={() => setActiveTab("wishlist")} className={`navBtn nav-wishlist ${activeTab === "wishlist" ? "selected" : ""}`}>Wishlist</button>
                    </ul>
                </nav>
            </header>
            <main>
                {activeTab === "home" && (
                <section className="home-section">
                    <div className="products-section app-section">
                        <Suspense fallback={<div>Loading Products...</div>}>
                            <ProductApp />
                        </Suspense>
                    </div>
                    <div className="cart-section app-section">
                        <Suspense fallback={<div>Loading Cart...</div>}>
                            <CartApp />
                        </Suspense>
                    </div>
                </section>)}
                {activeTab === "products" && (
                    <section className="products-only-section">
                        <Suspense fallback={<div>Loading Products...</div>}>
                            <ProductApp />
                        </Suspense>
                    </section>)}
                {activeTab === "cart" && (
                    <section className="cart-only-section ">
                        <Suspense fallback={<div>Loading Cart...</div>}>
                            <CartApp />
                        </Suspense>
                    </section>)}
            </main>
            <footer>
                <p>© 2024 My Website</p>
            </footer>
        
        </>
    );
}
export default Homepage;