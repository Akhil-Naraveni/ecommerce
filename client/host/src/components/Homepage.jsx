import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Homepage.css";

const ProductApp = React.lazy(() => import("products_app/Products"));
const CartApp = React.lazy(() => import("cart_app/Cart"));

import twitterIcon from "../../icons/twitter.svg";
import facebookIcon from "../../icons/facebook.svg";
import instagramIcon from "../../icons/instagram.svg";
import profilelogoIcon from "../../icons/profilelogo.svg";

import { selectCartTotalQuantity, setCartFromItems } from "../store/cartSummarySlice";
import { selectProductCategory, selectProductQuery, setProductCategory, setProductQuery } from "../store/productSearchSlice";
import useDebouncedValue from "../hooks/useDebouncedValue";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const dispatch = useDispatch();

  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const productQuery = useSelector(selectProductQuery);
  const productCategory = useSelector(selectProductCategory);

  const debouncedQuery = useDebouncedValue(productQuery, 300);
  const debouncedCategory = useDebouncedValue(productCategory, 150);
  const searchEventDetail = useMemo(() => ({ query: debouncedQuery, category: debouncedCategory }), [debouncedQuery, debouncedCategory]);

  useEffect(() => {
    const handleCartUpdated = (event) => {
      if (event.detail && event.detail.cartItems) {
        dispatch(setCartFromItems(event.detail.cartItems));
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [dispatch]);

  useEffect(() => {
    const evt = new CustomEvent("productsSearchChanged", { detail: searchEventDetail });
    window.dispatchEvent(evt);
  }, [searchEventDetail]);

  return (
    <>
      <header>
        <nav>
          <div className="navItemCtr">
            <button
              type="button"
              onClick={() => setActiveTab("home")}
              className={`navBtn nav-home ${activeTab === "home" ? "selected" : ""}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`navBtn nav-products ${activeTab === "products" ? "selected" : ""}`}
            >
              Products
            </button>

            <div className="searchCtr">
              <input
                className="searchInput"
                type="search"
                value={productQuery}
                onChange={(e) => dispatch(setProductQuery(e.target.value))}
                placeholder="Search products..."
                aria-label="Search products"
              />
              <select
                className="searchSelect"
                value={productCategory}
                onChange={(e) => dispatch(setProductCategory(e.target.value))}
                aria-label="Filter by category"
              >
                <option value="all">All</option>
                <option value="Clothing">Clothing</option>
                <option value="Sportswear">Sportswear</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("cart")}
              className={`navBtn nav-cart ${activeTab === "cart" ? "selected" : ""}`}
            >
              Cart
              {cartTotalQuantity > 0 && <span className="badge">{cartTotalQuantity}</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`navBtn nav-wishlist ${activeTab === "wishlist" ? "selected" : ""}`}
            >
              Wishlist
              <span className="badge">{0}</span>
            </button>
            <button type="button" className={`navBtn nav-account ${activeTab === "account" ? "selected" : ""}`}>
              <img src={profilelogoIcon} alt="Profile" />
            </button>
          </div>
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
          </section>
        )}
        {activeTab === "products" && (
          <section className="products-only-section">
            <Suspense fallback={<div>Loading Products...</div>}>
              <ProductApp />
            </Suspense>
          </section>
        )}
        {activeTab === "cart" && (
          <section className="cart-only-section ">
            <Suspense fallback={<div>Loading Cart...</div>}>
              <CartApp />
            </Suspense>
          </section>
        )}
      </main>

      <footer>
        <div className="followtext">Follow us on</div>
        <div className="social-icons">
          <div className="icon-container">
            <img src={twitterIcon} alt="Twitter Icon" width="24" height="24" />
            <span>GenZTrends</span>
          </div>
          <div className="icon-container">
            <img src={facebookIcon} alt="Facebook Icon" width="24" height="24" />
            <span>GenZTrends</span>
          </div>
          <div className="icon-container">
            <img src={instagramIcon} alt="Instagram Icon" width="24" height="24" />
            <span>@GenZTrends</span>
          </div>
        </div>
        <div>(c) 2026 Akhil Naraveni Website</div>
      </footer>
    </>
  );
};

export default Homepage;
