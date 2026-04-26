import { createSlice } from "@reduxjs/toolkit";

const productSearchSlice = createSlice({
  name: "productSearch",
  initialState: {
    query: "",
    category: "all",
  },
  reducers: {
    setProductQuery: (state, action) => {
      state.query = action.payload || "";
    },
    setProductCategory: (state, action) => {
      state.category = action.payload || "all";
    },
    clearProductSearch: (state) => {
      state.query = "";
      state.category = "all";
    },
  },
});

export const { setProductQuery, setProductCategory, clearProductSearch } = productSearchSlice.actions;
export const selectProductQuery = (state) => state.productSearch.query;
export const selectProductCategory = (state) => state.productSearch.category;

export default productSearchSlice.reducer;

