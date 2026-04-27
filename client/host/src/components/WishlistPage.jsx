import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./WishlistPage.css";

import { cartAPI } from "../services/apiService";
import { clearWishlist, removeWishlistItem, selectWishlistItems } from "../store/wishlistSlice";

const getProductId = (product) => product?._id || product?.id;

const WishlistPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [addingAll, setAddingAll] = useState(false);

  const ids = useMemo(() => items.map(getProductId).filter(Boolean), [items]);

  const setBusy = useCallback((id, isBusy) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const dispatchCartRefresh = useCallback(() => {
    window.dispatchEvent(new CustomEvent("productAddedToCart", { detail: { source: "wishlist" } }));
  }, []);

  const handleAddToCart = useCallback(
    async (product) => {
      const id = getProductId(product);
      if (!id) return;
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login to add items to cart");
        return;
      }

      setBusy(id, true);
      try {
        await cartAPI.addItem(id, 1);
        dispatchCartRefresh();
        dispatch(removeWishlistItem(id));
        window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: ids.filter((x) => x !== id) } }));
      } catch (err) {
        const apiMessage = err?.response?.data?.error || err?.response?.data?.message;
        alert(apiMessage || "Failed to add item to cart");
      } finally {
        setBusy(id, false);
      }
    },
    [dispatch, dispatchCartRefresh, ids, setBusy]
  );

  const handleAddAll = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    setAddingAll(true);
    try {
      const addedIds = [];
      for (const product of items) {
        const id = getProductId(product);
        if (!id) continue;
        // Keep it simple and reliable: sequential adds
        await cartAPI.addItem(id, 1);
        addedIds.push(id);
      }
      dispatchCartRefresh();
      if (addedIds.length === items.length) {
        dispatch(clearWishlist());
        window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: [] } }));
      } else if (addedIds.length > 0) {
        const remaining = ids.filter((id) => !addedIds.includes(id));
        for (const id of addedIds) dispatch(removeWishlistItem(id));
        window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: remaining } }));
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.error || err?.response?.data?.message;
      alert(apiMessage || "Failed to add some items to cart");
    } finally {
      setAddingAll(false);
    }
  }, [dispatch, dispatchCartRefresh, ids, items]);

  const handleRemove = useCallback(
    (product) => {
      const id = getProductId(product);
      if (!id) return;
      dispatch(removeWishlistItem(id));
      // keep products_app selection icons in sync when it's mounted
      window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: ids.filter((x) => x !== id) } }));
    },
    [dispatch, ids]
  );

  const handleClear = useCallback(() => {
    dispatch(clearWishlist());
    window.dispatchEvent(new CustomEvent("wishlistSync", { detail: { ids: [] } }));
  }, [dispatch]);

  return (
    <div className="wishlistPage">
      <div className="wishlistHead">
        <h1>Wishlist</h1>
        <div className="wishlistActions">
          <button type="button" className="wishlistBtn" onClick={handleAddAll} disabled={addingAll || items.length === 0}>
            {addingAll ? "Adding..." : "Add All to Cart"}
          </button>
          <button type="button" className="wishlistBtn danger" onClick={handleClear} disabled={items.length === 0}>
            Clear
          </button>
        </div>
      </div>

      <hr />

      {items.length === 0 ? (
        <div className="wishlistEmpty">
          <h2>Your wishlist is empty.</h2>
          <p>Add products to wishlist to see them here.</p>
        </div>
      ) : (
        <div className="productscontainer">
          {items.map((product, idx) => {
            const id = getProductId(product);
            const isBusy = id ? busyIds.has(id) : false;
            const ratingRate = product?.rating?.rate;
            const ratingCount = product?.rating?.count;
            return (
              <div className="productcard" key={id || `${product?.name || "item"}-${idx}`}>
                {ratingRate != null && ratingCount != null && (
                  <span className="rating">
                    {ratingRate} ({ratingCount})
                  </span>
                )}
                <img src={product?.image} loading="lazy" alt={product?.name || "Product"} width="200" height="200" />
                <h4 title={product?.name || ""}>{product?.name || "Unnamed product"}</h4>
                <p>{product?.description || ""}</p>
                <p className="price">Price: ${product?.price}</p>
                <div className="btn-container">
                  <button className="addtocartbtn" onClick={() => handleAddToCart(product)} disabled={isBusy || addingAll}>
                    {isBusy ? "Adding..." : "Add to Cart"}
                  </button>
                  <button type="button" className="wishlistRemoveBtn" onClick={() => handleRemove(product)} disabled={addingAll}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
