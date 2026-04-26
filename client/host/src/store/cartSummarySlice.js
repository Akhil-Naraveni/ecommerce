import { createSlice } from "@reduxjs/toolkit";

const summarizeItems = (items) => {
  const safeItems = Array.isArray(items) ? items : [];
  const uniqueItems = safeItems.length;
  const totalQuantity = safeItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
  const totalPrice = safeItems.reduce((sum, item) => {
    const price = Number(item?.product?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  return { uniqueItems, totalQuantity, totalPrice };
};

const cartSummarySlice = createSlice({
  name: "cartSummary",
  initialState: {
    uniqueItems: 0,
    totalQuantity: 0,
    totalPrice: 0,
    lastUpdatedAt: null,
  },
  reducers: {
    setCartFromItems: (state, action) => {
      const { uniqueItems, totalQuantity, totalPrice } = summarizeItems(action.payload);
      state.uniqueItems = uniqueItems;
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      state.lastUpdatedAt = Date.now();
    },
    clearCartSummary: (state) => {
      state.uniqueItems = 0;
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.lastUpdatedAt = Date.now();
    },
  },
});

export const { setCartFromItems, clearCartSummary } = cartSummarySlice.actions;
export const selectCartUniqueItems = (state) => state.cartSummary.uniqueItems;
export const selectCartTotalQuantity = (state) => state.cartSummary.totalQuantity;
export const selectCartTotalPrice = (state) => state.cartSummary.totalPrice;

export default cartSummarySlice.reducer;

