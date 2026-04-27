import { createSelector, createSlice } from "@reduxjs/toolkit";

const getProductId = (product) => product?._id || product?.id;

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    lastUpdatedAt: null,
  },
  reducers: {
    addWishlistItem: (state, action) => {
      const product = action.payload;
      const id = getProductId(product);
      if (!id) return;
      const exists = state.items.some((p) => getProductId(p) === id);
      if (exists) return;
      state.items.unshift(product);
      state.lastUpdatedAt = Date.now();
    },
    removeWishlistItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((p) => getProductId(p) !== id);
      state.lastUpdatedAt = Date.now();
    },
    clearWishlist: (state) => {
      state.items = [];
      state.lastUpdatedAt = Date.now();
    },
    setWishlistFromProducts: (state, action) => {
      const list = Array.isArray(action.payload) ? action.payload : [];
      const unique = [];
      const seen = new Set();
      for (const p of list) {
        const id = getProductId(p);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        unique.push(p);
      }
      state.items = unique;
      state.lastUpdatedAt = Date.now();
    },
  },
});

export const { addWishlistItem, removeWishlistItem, clearWishlist, setWishlistFromProducts } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistIds = createSelector([selectWishlistItems], (items) =>
  items.map((p) => getProductId(p)).filter(Boolean)
);

export default wishlistSlice.reducer;
