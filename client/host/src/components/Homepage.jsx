import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const ProductApp = React.lazy(() => import("products_app/Products"));
const CartApp = React.lazy(() => import("cart_app/Cart"));

import twitterIcon from "../../icons/twitter.svg";
import facebookIcon from "../../icons/facebook.svg";
import instagramIcon from "../../icons/instagram.svg";
import profilelogoIcon from "../../icons/profilelogo.svg";

import { selectCartTotalQuantity, setCartFromItems } from "../store/cartSummarySlice";
import { selectProductCategory, selectProductQuery, setProductCategory, setProductQuery } from "../store/productSearchSlice";
import { addWishlistItem, removeWishlistItem, selectWishlistCount, selectWishlistIds } from "../store/wishlistSlice";
import useDebouncedValue from "../hooks/useDebouncedValue";
import WishlistPage from "./WishlistPage";
import { cartAPI } from "../services/apiService";
import { logoutUser, selectAuthUser } from "../store/authSlice";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [accountOpen, setAccountOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const wishlistCount = useSelector(selectWishlistCount);
  const wishlistIds = useSelector(selectWishlistIds);
  const productQuery = useSelector(selectProductQuery);
  const productCategory = useSelector(selectProductCategory);
  const authUser = useSelector(selectAuthUser);

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
    let cancelled = false;

    const refreshCartSummary = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await cartAPI.getItems();
        const items = res?.data?.cart?.items || [];
        if (!cancelled) dispatch(setCartFromItems(items));
      } catch {
        // Ignore: cart summary shouldn't break the shell.
      }
    };

    // Initial load (important for Products-only / Wishlist tabs where cart_app isn't mounted)
    refreshCartSummary();

    const handleProductAddedToCart = () => {
      refreshCartSummary();
    };

    window.addEventListener("productAddedToCart", handleProductAddedToCart);
    return () => {
      cancelled = true;
      window.removeEventListener("productAddedToCart", handleProductAddedToCart);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleWishlistUpdated = (event) => {
      const detail = event?.detail || {};
      const product = detail.product;
      const action = detail.action;
      const id = product?._id || product?.id || detail.productId || detail.id;

      if (action === "remove" && id) {
        dispatch(removeWishlistItem(id));
      } else if (action === "add" && product) {
        dispatch(addWishlistItem(product));
      } else if (action === "toggle" && product && id) {
        // fallback if caller only sends "toggle" + "selected"
        if (detail.selected === false) dispatch(removeWishlistItem(id));
        else dispatch(addWishlistItem(product));
      }
    };

    const handleWishlistRequest = () => {
      window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: wishlistIds } }));
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdated);
    window.addEventListener("wishlistRequest", handleWishlistRequest);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
      window.removeEventListener("wishlistRequest", handleWishlistRequest);
    };
  }, [dispatch, wishlistIds]);

  useEffect(() => {
    // Keep products_app in sync when it is mounted.
    window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: wishlistIds } }));
  }, [wishlistIds]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (wishlistCount <= 0) return;
      // Standard browser prompt; custom text is ignored by most browsers.
      e.preventDefault();
      const msg = "You have items in your wishlist. Refreshing will clear them unless you add them to cart.";
      e.returnValue = msg;
      return msg;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [wishlistCount]);

  useEffect(() => {
    const evt = new CustomEvent("productsSearchChanged", { detail: searchEventDetail });
    window.dispatchEvent(evt);
  }, [searchEventDetail]);

  useEffect(() => {
    const handleDocMouseDown = (e) => {
      if (!accountOpen) return;
      if (!accountRef.current) return;
      if (accountRef.current.contains(e.target)) return;
      setAccountOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", handleDocMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountOpen]);

  const displayName = (authUser?.name || authUser?.email || "").trim();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setAccountOpen(false);
    navigate("/login", { replace: true });
  };

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

            {(activeTab === "home" || activeTab === "products") && <div className="searchCtr">
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
            </div>}

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
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </button>
            <div className="nav-accountWrap" ref={accountRef}>
              <button
                type="button"
                className={`navBtn nav-account ${accountOpen ? "selected" : ""}`}
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <img src={profilelogoIcon} alt="Profile" />
              </button>
              {accountOpen && (
                <div className="accountMenu" role="menu">
                  <div className="accountName" role="menuitem">
                    {displayName || "Account"}
                  </div>
                  <button type="button" className="accountLogoutBtn" onClick={handleLogout} role="menuitem">
                    Logout
                  </button>
                </div>
              )}
            </div>
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
        {activeTab === "wishlist" && (
          <section className="wishlist-only-section">
            <WishlistPage />
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
